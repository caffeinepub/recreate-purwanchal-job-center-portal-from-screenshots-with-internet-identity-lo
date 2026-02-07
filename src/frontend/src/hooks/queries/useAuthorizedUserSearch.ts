import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { SearchableUserProfile } from '../../backend';

export function useAuthorizedUserSearch(searchTerm: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<SearchableUserProfile[]>({
    queryKey: ['authorizedUserSearch', searchTerm],
    queryFn: async () => {
      if (!actor) throw new Error('System not ready. Please try again.');
      
      try {
        return await actor.authorizedUserSearch(searchTerm);
      } catch (error: any) {
        const message = error?.message || String(error);
        if (message.includes('Unauthorized') || message.includes('Only admins')) {
          throw new Error('Access denied. Admin privileges required.');
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
