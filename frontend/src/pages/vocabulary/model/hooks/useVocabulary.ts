import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';

import { listModules, studyQueryKey } from '@entities/study';

import { getVocabularyWords } from '../../lib/getVocabularyWords';
import type { VocabularyFilters } from '../../types';

export const useVocabulary = () => {
  const modulesQuery = useQuery({ queryKey: [...studyQueryKey, 'list'], queryFn: listModules });
  const filters = useForm<VocabularyFilters>({ defaultValues: { search: '', moduleId: '' } });
  const vocabulary = getVocabularyWords(modulesQuery.data ?? [], filters.watch());

  return { modulesQuery, filters, ...vocabulary };
};
