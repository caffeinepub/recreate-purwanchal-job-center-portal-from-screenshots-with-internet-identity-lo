import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Application, ExternalBlob } from '../../backend';

export function useGetMyApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<Application[]>({
    queryKey: ['myApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApplyForJob() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobId,
      coverLetter,
      resume,
    }: {
      jobId: bigint;
      coverLetter: string;
      resume: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.applyForJob(jobId, coverLetter, resume);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myApplications'] });
    },
  });
}
