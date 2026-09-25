import type { StudyModule } from '@entities/study';

import type { VocabularyFilters, VocabularyWord } from '../types';

export const getVocabularyWords = (modules: StudyModule[], filters: VocabularyFilters) => {
  const search = filters.search.normalize('NFKC').trim().toLocaleLowerCase();
  const words: VocabularyWord[] = modules.flatMap((module) => {
    return module.cards.map((card) => {
      return {
        id: card.id,
        term: card.term,
        definition: card.definition,
        moduleId: module.id,
        moduleTitle: module.title,
      };
    });
  });
  const filteredWords = words.filter((word) => {
    const matchesModule = !filters.moduleId || word.moduleId === filters.moduleId;
    const matchesSearch = [word.term, word.definition, word.moduleTitle].some((text) => {
      return text.normalize('NFKC').toLocaleLowerCase().includes(search);
    });

    return matchesModule && matchesSearch;
  });
  filteredWords.sort((first, second) => {
    return (
      first.term.localeCompare(second.term) ||
      first.moduleTitle.localeCompare(second.moduleTitle) ||
      first.id.localeCompare(second.id)
    );
  });

  return { words: filteredWords, total: words.length };
};
