import type { Answer, Estimate, QuizBlock, QuizItem, Trait } from './types';

export const TRAITS: Trait[] = ['O', 'C', 'E', 'A', 'N'];

const traitLabels: Record<Trait, string> = {
  O: 'Openness',
  C: 'Conscientiousness',
  E: 'Extraversion',
  A: 'Agreeableness',
  N: 'Emotional sensitivity',
};

export function getTraitLabel(trait: Trait): string {
  return traitLabels[trait];
}

export function estimateFromAnswers(blocks: QuizBlock[], answers: Answer[]): Estimate {
  const itemById = new Map<string, QuizItem>();
  const blockById = new Map<string, QuizBlock>();
  blocks.forEach((block) => {
    blockById.set(block.id, block);
    block.items.forEach((item) => itemById.set(item.id, item));
  });

  const comparisons = answers.flatMap((answer) => buildComparisons(blockById.get(answer.blockId), answer));
  const thetaVector = solveMap(comparisons);
  const information = estimateInformation(comparisons, thetaVector);

  const theta = Object.fromEntries(TRAITS.map((trait, index) => [trait, thetaVector[index]])) as Record<
    Trait,
    number
  >;

  const sem = Object.fromEntries(
    TRAITS.map((trait, index) => [trait, clamp(1 / Math.sqrt(information[index]), 0.18, 1.2)]),
  ) as Record<Trait, number>;

  const percentiles = Object.fromEntries(
    TRAITS.map((trait) => [trait, Math.round(normalCdf(theta[trait]) * 100)]),
  ) as Record<Trait, number>;

  const semMax = Math.max(...TRAITS.map((trait) => sem[trait]));
  const accuracy = clamp(Math.floor((1 - semMax / 1.2) * 100), 10, 99);

  return { theta, sem, percentiles, accuracy };
}

interface Comparison {
  preferred: QuizItem;
  rejected: QuizItem;
}

function buildComparisons(block: QuizBlock | undefined, answer: Answer): Comparison[] {
  if (!block) return [];
  const best = block.items.find((item) => item.id === answer.bestItemId);
  const worst = block.items.find((item) => item.id === answer.worstItemId);
  if (!best || !worst) return [];

  const middle = block.items.filter((item) => item.id !== best.id && item.id !== worst.id);
  return [
    ...middle.map((item) => ({ preferred: best, rejected: item })),
    { preferred: best, rejected: worst },
    ...middle.map((item) => ({ preferred: item, rejected: worst })),
  ];
}

function solveMap(comparisons: Comparison[]): number[] {
  const theta = [0, 0, 0, 0, 0];
  if (comparisons.length === 0) return theta;

  for (let iteration = 0; iteration < 90; iteration += 1) {
    const gradient = theta.map((value) => -value);

    for (const comparison of comparisons) {
      const diff = vectorFor(comparison.preferred).map(
        (value, index) => value - vectorFor(comparison.rejected)[index],
      );
      const z = utility(comparison.preferred, theta) - utility(comparison.rejected, theta);
      const residual = 1 - sigmoid(z);
      for (let index = 0; index < theta.length; index += 1) {
        gradient[index] += residual * diff[index];
      }
    }

    const step = 0.18 / (1 + iteration * 0.018);
    for (let index = 0; index < theta.length; index += 1) {
      theta[index] = clamp(theta[index] + step * gradient[index], -2.4, 2.4);
    }
  }

  return theta;
}

function estimateInformation(comparisons: Comparison[], theta: number[]): number[] {
  const information = [1, 1, 1, 1, 1];
  for (const comparison of comparisons) {
    const preferred = vectorFor(comparison.preferred);
    const rejected = vectorFor(comparison.rejected);
    const z = utility(comparison.preferred, theta) - utility(comparison.rejected, theta);
    const p = sigmoid(z);
    const weight = p * (1 - p);
    for (let index = 0; index < information.length; index += 1) {
      const diff = preferred[index] - rejected[index];
      information[index] += weight * diff * diff;
    }
  }
  return information;
}

function utility(item: QuizItem, theta: number[]): number {
  const vector = vectorFor(item);
  return item.mu + vector.reduce((total, value, index) => total + value * theta[index], 0);
}

function vectorFor(item: QuizItem): number[] {
  return TRAITS.map((trait) => (item.trait === trait ? item.lambda * item.direction : 0));
}

function sigmoid(value: number): number {
  if (value >= 0) {
    const z = Math.exp(-value);
    return 1 / (1 + z);
  }
  const z = Math.exp(value);
  return z / (1 + z);
}

function normalCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const abs = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * abs);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-abs * abs));
  return sign * y;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
