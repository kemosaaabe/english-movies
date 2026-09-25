import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sessionAction, studyQueryKey } from '@entities/study';

import type { SessionMutation } from '../../types';

export const useLearnSession = (moduleId: string) => {
  const queryClient = useQueryClient();
  const queryKey = [...studyQueryKey, moduleId, 'session'];
  const session = useQuery({
    queryKey,
    queryFn: () => {
      return sessionAction(moduleId, 'resume');
    },
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  const mutation = useMutation({
    mutationFn: ({ action, answer }: SessionMutation) => {
      return sessionAction(moduleId, action, {
        sessionId: session.data?.id,
        questionId: session.data?.question?.id,
        answer,
      });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKey, data);
      void queryClient.invalidateQueries({ queryKey: [...studyQueryKey, moduleId, 'detail'] });
    },
  });

  return { session, mutation };
};
