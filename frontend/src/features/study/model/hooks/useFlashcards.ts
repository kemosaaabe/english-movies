import { useState } from 'react';

import type { Card, Progress } from '@entities/study';

import { shuffleCards } from '../../lib';
import { getNextCardIndex } from '../../lib/getNextCardIndex';
import type { StudyFilter } from '../../types';

export const useFlashcards = (cards: Card[], progress: Record<string, Progress>) => {
  const [orderedCards, setOrderedCards] = useState(cards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [filter, setFilter] = useState<StudyFilter>('all');
  const [isComplete, setIsComplete] = useState(false);

  const restart = (nextFilter: StudyFilter = filter, nextShuffle = isShuffled) => {
    const filteredCards = cards.filter((card) => {
      const status = progress[card.id]?.flashcardStatus ?? 'unreviewed';

      return nextFilter === 'all' || (nextFilter === 'known' ? status === 'known' : status !== 'known');
    });

    setFilter(nextFilter);
    setIsShuffled(nextShuffle);
    setOrderedCards(nextShuffle ? shuffleCards(filteredCards) : filteredCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsComplete(false);
  };

  const navigate = (direction: number) => {
    setCurrentCardIndex((previousIndex) => {
      return getNextCardIndex(previousIndex, direction, orderedCards.length, isLooping);
    });
    setIsFlipped(false);
  };

  return {
    orderedCards,
    currentCardIndex,
    isFlipped,
    isShuffled,
    isReversed,
    isLooping,
    filter,
    isComplete,
    restart,
    navigate,
    setIsFlipped,
    setIsReversed,
    setIsLooping,
    setIsComplete,
  };
};
