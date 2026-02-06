import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useAdminPassword } from '../useAdminPassword';
import type { SearchableUserProfile } from '../../backend';

export function useAuthorizedUserSearch(searchTerm: string | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { sessionPassword, lock } = useAdminPassword();

  return useQuery<SearchableUserProfile[]>({
    queryKey: ['authorizedUserSearch', searchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!sessionPassword) {
        throw new Error('Admin password required');
      }

      try {
        return await actor.authorizedUserSearch(sessionPassword, searchTerm);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized') || error.message?.includes('trap')) {
          lock();
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && !!sessionPassword,
    retry: false,
  });
}
