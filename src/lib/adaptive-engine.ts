import { shuffleWithSeed } from './random';
import { TRAITS } from './tirt-estimator';
import type { Answer, Estimate, QuizBlock, ShownBlock, Trait } from './types';

export function prepareSessionBlocks(blocks: QuizBlock[], seed: number): ShownBlock[] {
  return shuffleWithSeed(blocks, seed).map((block, index) => ({
    ...block,
    orderIndex: index,
    items: shuffleWithSeed(block.items, seed + hashString(block.id)),
  }));
}

export function selectNextBlock(
  blocks: ShownBlock[],
  answers: Answer[],
  estimate: Estimate,
  seed: number,
): ShownBlock | null {
  const answered = new Set(answers.map((answer) => answer.blockId));
  const candidates = blocks.filter((block) => !answered.has(block.id));
  if (candidates.length === 0) return null;

  const coverage = getTraitCoverage(blocks, answers);
  const lastTraits = getRecentTraits(blocks, answers);

  return candidates
    .map((block) => ({
      block,
      score: scoreBlock(block, estimate, coverage, lastTraits) + tieBreak(seed, block.id),
    }))
    .sort((a, b) => b.score - a.score)[0].block;
}

function scoreBlock(
  block: QuizBlock,
  estimate: Estimate,
  coverage: Record<Trait, number>,
  lastTraits: Trait[],
): number {
  const traits = new Set(block.items.map((item) => item.trait));
  let score = 0;

  for (const item of block.items) {
    const uncertainty = estimate.sem[item.trait] / 1.2;
    const underCovered = 1 / (1 + coverage[item.trait]);
    const centrality = 1 - Math.min(1, Math.abs(estimate.theta[item.trait]) / 2.6);
    score += item.lambda * item.lambda * (1 + uncertainty + underCovered + centrality * 0.35);
  }

  for (const trait of traits) {
    if (lastTraits.includes(trait)) score -= 0.35;
  }

  return score;
}

function getTraitCoverage(blocks: QuizBlock[], answers: Answer[]): Record<Trait, number> {
  const coverage = Object.fromEntries(TRAITS.map((trait) => [trait, 0])) as Record<Trait, number>;
  const answered = new Set(answers.map((answer) => answer.blockId));
  for (const block of blocks) {
    if (!answered.has(block.id)) continue;
    for (const item of block.items) coverage[item.trait] += 1;
  }
  return coverage;
}

function getRecentTraits(blocks: QuizBlock[], answers: Answer[]): Trait[] {
  const recent = answers.slice(-2).map((answer) => answer.blockId);
  return blocks
    .filter((block) => recent.includes(block.id))
    .flatMap((block) => block.items.map((item) => item.trait));
}

function tieBreak(seed: number, blockId: string): number {
  return (hashString(`${seed}:${blockId}`) % 1000) / 100000;
}

function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
