import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { JobVacancy } from '../../backend';

export function useGetJobVacancies() {
  const { actor, isFetching } = useActor();

  return useQuery<JobVacancy[]>({
    queryKey: ['jobVacancies'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobVacancies();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchJobVacancies(searchTerm: string | null) {
  const { actor, isFetching } = useActor();

  return useQuery<JobVacancy[]>({
    queryKey: ['jobVacancies', 'search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchJobVacancies(searchTerm);
    },
    enabled: !!actor && !isFetching && searchTerm !== null,
  });
}

export function useGetJobVacancy(jobId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<JobVacancy>({
    queryKey: ['jobVacancy', jobId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getJobVacancy(jobId);
    },
    enabled: !!actor && !isFetching,
  });
}
