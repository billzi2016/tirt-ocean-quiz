export type Trait = 'O' | 'C' | 'E' | 'A' | 'N';

export interface QuizItem {
  id: string;
  trait: Trait;
  direction: 1 | -1;
  lambda: number;
  mu: number;
  text: Record<string, string>;
}

export interface QuizBlock {
  id: string;
  items: QuizItem[];
}

export interface ShownBlock extends QuizBlock {
  orderIndex: number;
}

export interface Answer {
  blockId: string;
  bestItemId: string;
  worstItemId: string;
}

export interface Estimate {
  theta: Record<Trait, number>;
  percentiles: Record<Trait, number>;
  sem: Record<Trait, number>;
  accuracy: number;
}

export interface Evaluation {
  title: string;
  subtitle: string;
  summary: string;
  examples: string[];
}
