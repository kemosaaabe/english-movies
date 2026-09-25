export interface VocabularyWord {
  id: string;
  term: string;
  definition: string;
  moduleId: string;
  moduleTitle: string;
}

export interface VocabularyFilters {
  search: string;
  moduleId: string;
}
