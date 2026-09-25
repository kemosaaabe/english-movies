import type { CardInput, SessionAction } from '@entities/study';

export type StudyFilter = 'all' | 'known' | 'learning';

export interface SessionMutation {
  action: SessionAction;
  answer?: string;
}

export interface WrittenAnswerInput {
  answer: string;
}

export interface CardImportResult {
  cards: CardInput[];
  invalidLines: number[];
}

export interface CardImportInput {
  text: string;
}
