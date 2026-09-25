export const getNextCardIndex = (
  currentIndex: number,
  direction: number,
  cardCount: number,
  isLooping: boolean,
) => {
  if (cardCount === 0) {
    return 0;
  }

  const nextIndex = currentIndex + direction;

  return isLooping
    ? ((nextIndex % cardCount) + cardCount) % cardCount
    : Math.max(0, Math.min(nextIndex, cardCount - 1));
};
