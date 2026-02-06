import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Post } from '../../backend';

export function useGetPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPosts();
    },
    enabled: !!actor && !isFetching,
  });
}
