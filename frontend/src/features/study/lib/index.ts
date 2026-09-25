import { masteryLevels } from '@entities/study';
import type { Card, LearnSession, Progress } from '@entities/study';

export const shuffleCards = (cards: Card[]) => {
  const result = [...cards];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }

  return result;
};

export const flashcardCounts = (cards: Card[], progress: Record<string, Progress>) => {
  const known = cards.filter((card) => {
    return progress[card.id]?.flashcardStatus === 'known';
  }).length;
  const learning = cards.filter((card) => {
    return progress[card.id]?.flashcardStatus === 'learning';
  }).length;

  return { total: cards.length, known, learning, unreviewed: cards.length - known - learning };
};

export const learningSummary = (session: LearnSession) => {
  const levels = [0, ...masteryLevels].map((level) => {
    return session.cards.filter((card) => {
      return session.progress[card.id].masteryLevel === level;
    }).length;
  });
  const totalMastery = levels.reduce((total, cardCount, level) => {
    return total + cardCount * level;
  }, 0);
  const maximumMastery = session.cards.length * masteryLevels.length;

  return {
    levels,
    percentage: maximumMastery ? (totalMastery / maximumMastery) * 100 : 0,
    accuracy: session.total ? Math.round((session.correct / session.total) * 100) : 0,
  };
};
