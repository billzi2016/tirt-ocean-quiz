import { selectNextBlock } from './adaptive-engine';
import { estimateFromAnswers } from './tirt-estimator';
import type { Answer, Estimate, ShownBlock } from './types';

const STORAGE_KEY = 'tirt-ocean-session-v1';

export interface QuizState {
  seed: number;
  answers: Answer[];
  currentBlockId: string | null;
}

export function loadState(): QuizState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizState;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveState(state: QuizState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function advance(
  blocks: ShownBlock[],
  state: QuizState,
  answer: Answer,
): { state: QuizState; estimate: Estimate; complete: boolean } {
  const answers = [...state.answers.filter((item) => item.blockId !== answer.blockId), answer];
  const estimate = estimateFromAnswers(blocks, answers);
  const next = selectNextBlock(blocks, answers, estimate, state.seed);
  const nextState = {
    ...state,
    answers,
    currentBlockId: next?.id ?? null,
  };
  saveState(nextState);
  return { state: nextState, estimate, complete: next === null };
}
