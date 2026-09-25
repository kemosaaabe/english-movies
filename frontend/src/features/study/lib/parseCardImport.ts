import type { CardInput } from '@entities/study';

import type { CardImportResult } from '../types';

export const parseCardImport = (text: string): CardImportResult => {
  const cards: CardInput[] = [];
  const invalidLines: number[] = [];

  text.split(/\r?\n/u).forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return;
    }

    const separator = trimmedLine.includes('\t') ? /\t+/u : trimmedLine.includes(';') ? /;/u : /\s+/u;
    const separatorMatch = separator.exec(trimmedLine);

    if (!separatorMatch) {
      invalidLines.push(index + 1);

      return;
    }

    const term = trimmedLine.slice(0, separatorMatch.index).trim();
    const definition = trimmedLine.slice(separatorMatch.index + separatorMatch[0].length).trim();

    if (!term || !definition) {
      invalidLines.push(index + 1);

      return;
    }

    cards.push({ term, definition });
  });

  return { cards, invalidLines };
};
