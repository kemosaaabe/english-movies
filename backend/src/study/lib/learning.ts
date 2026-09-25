import { randomUUID } from 'node:crypto';

import { maximumMastery, reviewDelay } from '../constants';
import type { Card, LearnSession, Progress, Question } from '../types';

export const emptyProgress = (): Progress => {
  return {
    flashcardStatus: 'unreviewed',
    masteryLevel: 0,
    totalAttempts: 0,
    correctAttempts: 0,
    incorrectAttempts: 0,
    lastReviewedAt: null,
  };
};

export const normalizeAnswer = (answer: string) => {
  return answer.normalize('NFKC').trim().replace(/\s+/gu, ' ').toLocaleLowerCase('en');
};

export const shuffle = <T>(items: T[], random: () => number = Math.random) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }

  return result;
};

export const updateMastery = (progress: Progress, correct: boolean): Progress => {
  return {
    ...progress,
    masteryLevel: Math.max(0, Math.min(maximumMastery, progress.masteryLevel + (correct ? 1 : -1))),
    totalAttempts: progress.totalAttempts + 1,
    correctAttempts: progress.correctAttempts + Number(correct),
    incorrectAttempts: progress.incorrectAttempts + Number(!correct),
  };
};

export const selectNextCard = (session: LearnSession) => {
  const active = session.cards.filter((card) => {
    return session.progress[card.id].masteryLevel < maximumMastery;
  });
  const alternatives = active.filter((card) => {
    return card.id !== session.previousCardId;
  });
  const candidates = alternatives.length ? alternatives : active;
  const ready = candidates.filter((card) => {
    return (session.review[card.id] ?? 0) <= session.total;
  });
  const pool = ready.length ? ready : candidates;
  pool.sort((left, right) => {
    const leftProgress = session.progress[left.id];
    const rightProgress = session.progress[right.id];

    return (
      leftProgress.masteryLevel - rightProgress.masteryLevel ||
      rightProgress.incorrectAttempts - leftProgress.incorrectAttempts ||
      left.position - right.position
    );
  });

  return pool[0] ?? null;
};

export const makeQuestion = (card: Card, cards: Card[], mastery: number): Question => {
  const definitions = new Map<string, string>();
  definitions.set(normalizeAnswer(card.definition), card.definition);
  for (const other of shuffle(cards)) {
    const normalized = normalizeAnswer(other.definition);
    if (!definitions.has(normalized)) {
      definitions.set(normalized, other.definition);
    }
  }
  const options = shuffle([...definitions.values()].slice(0, 4));
  const type = mastery < 2 && options.length >= 2 ? 'choice' : 'written';

  return {
    id: randomUUID(),
    cardId: card.id,
    type,
    prompt: type === 'choice' ? card.term : card.definition,
    options: type === 'choice' ? options : [],
  };
};

export const advanceSession = (session: LearnSession): LearnSession => {
  const card = selectNextCard(session);

  return {
    ...session,
    feedback: null,
    question: card ? makeQuestion(card, session.cards, session.progress[card.id].masteryLevel) : null,
  };
};

export const answerSession = (session: LearnSession, questionId: string, answer: string): LearnSession => {
  if (!session.question || session.question.id !== questionId || session.feedback) {
    return session;
  }
  const card = session.cards.find((item) => {
    return item.id === session.question?.cardId;
  });
  if (!card || !normalizeAnswer(answer)) {
    throw new Error('An answer is required.');
  }
  const expected = session.question.type === 'choice' ? card.definition : card.term;
  const correct = normalizeAnswer(answer) === normalizeAnswer(expected);
  const progress = updateMastery(session.progress[card.id], correct);
  const total = session.total + 1;

  return {
    ...session,
    total,
    correct: session.correct + Number(correct),
    previousCardId: card.id,
    feedback: { answer, expected, correct, previousProgress: session.progress[card.id] },
    progress: { ...session.progress, [card.id]: { ...progress, lastReviewedAt: new Date().toISOString() } },
    review: { ...session.review, [card.id]: correct ? total : total + reviewDelay },
  };
};

export const overrideSessionAnswer = (session: LearnSession, questionId: string): LearnSession => {
  if (
    !session.question ||
    session.question.id !== questionId ||
    !session.feedback ||
    session.feedback.correct ||
    !session.feedback.previousProgress
  ) {
    return session;
  }

  const cardId = session.question.cardId;
  const currentProgress = session.progress[cardId];
  const previousProgress = session.feedback.previousProgress;
  const correctedProgress = updateMastery(previousProgress, true);

  return {
    ...session,
    correct: session.correct + 1,
    feedback: { ...session.feedback, correct: true, overridden: true, previousProgress },
    progress: {
      ...session.progress,
      [cardId]: { ...correctedProgress, lastReviewedAt: currentProgress.lastReviewedAt },
    },
    review: { ...session.review, [cardId]: session.total },
  };
};

export const summarizeSession = (session: LearnSession) => {
  const levels = [0, 1, 2, 3].map((level) => {
    return session.cards.filter((card) => {
      return session.progress[card.id].masteryLevel === level;
    }).length;
  });

  return {
    levels,
    complete: levels[3] === session.cards.length,
    percentage: session.cards.length ? (levels[3] / session.cards.length) * 100 : 0,
    accuracy: session.total ? (session.correct / session.total) * 100 : 0,
  };
};
