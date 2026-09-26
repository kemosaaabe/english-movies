import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '../../api';
import { currentUserQueryKey } from '../../constants';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    retry: false,
  });
};
