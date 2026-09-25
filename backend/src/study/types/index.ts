import type { Response } from 'express';

export type FlashcardStatus = 'unreviewed' | 'known' | 'learning';

export interface Card {
  id: string;
  moduleId: string;
  term: string;
  definition: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudyModule {
  id: string;
  title: string;
  description: string;
  cards: Card[];
  createdAt: string;
  updatedAt: string;
}

export interface CardInput {
  id?: string;
  term: string;
  definition: string;
}

export interface ModuleInput {
  title: string;
  description?: string;
  cards: CardInput[];
}

export interface Progress {
  flashcardStatus: FlashcardStatus;
  masteryLevel: number;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  lastReviewedAt: string | null;
}

export interface Question {
  id: string;
  cardId: string;
  type: 'choice' | 'written';
  prompt: string;
  options: string[];
}

export interface Feedback {
  answer: string;
  expected: string;
  correct: boolean;
  overridden?: boolean;
  previousProgress?: Progress;
}

export interface LearnSession {
  id: string;
  cards: Card[];
  progress: Record<string, Progress>;
  review: Record<string, number>;
  question: Question | null;
  feedback: Feedback | null;
  previousCardId: string | null;
  total: number;
  correct: number;
  reviewOnly: boolean;
}

export interface ModuleRow {
  document: StudyModule;
}

export interface SessionRow {
  document: LearnSession;
}

export interface ProgressRow {
  card_id: string;
  document: Progress;
}

export interface SessionInput {
  sessionId?: string;
  questionId?: string;
  answer?: string;
}

export interface StatusInput {
  status: FlashcardStatus;
}

export type GuestResponse = Response<unknown, { studyOwner: string }>;
