import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { UserRole } from '../../backend';

export function useGetCallerRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}
