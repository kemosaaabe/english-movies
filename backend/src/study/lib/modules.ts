import { BadRequestException } from '@nestjs/common';

import type { ModuleInput } from '../types';

export const validateModule = (input: ModuleInput) => {
  if (
    !input.title?.trim() ||
    !input.cards ||
    input.cards.length === 0 ||
    input.cards.some((card) => {
      return !card.term?.trim() || !card.definition?.trim();
    })
  ) {
    throw new BadRequestException('A title and at least one complete card are required.');
  }
  const ids = input.cards.flatMap((card) => {
    return card.id ? [card.id] : [];
  });
  if (new Set(ids).size !== ids.length) {
    throw new BadRequestException('Card identifiers must be unique.');
  }
};
