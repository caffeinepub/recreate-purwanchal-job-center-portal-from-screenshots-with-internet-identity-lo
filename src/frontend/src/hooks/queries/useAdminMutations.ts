import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { JobVacancy, ExternalBlob } from '../../backend';

export function useCreateJobVacancy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vacancy: JobVacancy) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createJobVacancy(vacancy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobVacancies'] });
    },
  });
}

export function useUpdateJobVacancy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ jobId, vacancy }: { jobId: bigint; vacancy: JobVacancy }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateJobVacancy(jobId, vacancy);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobVacancies'] });
    },
  });
}

export function useDeleteJobVacancy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteJobVacancy(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobVacancies'] });
    },
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content, image }: { title: string; content: string; image: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(title, content, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      title,
      content,
      image,
    }: {
      postId: bigint;
      title: string;
      content: string;
      image: ExternalBlob | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updatePost(postId, title, content, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
