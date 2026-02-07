import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { useAdminPassword } from '../useAdminPassword';
import { formatAdminError } from '../../utils/adminErrorFormatting';
import type { JobVacancy, ExternalBlob } from '../../backend';

export function useCreateJobVacancy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { lock } = useAdminPassword();

  return useMutation({
    mutationFn: async (vacancy: JobVacancy) => {
      if (!actor) throw new Error('System not ready. Please try again.');

      try {
        return await actor.createJobVacancy(vacancy);
      } catch (error: any) {
        const errorResult = formatAdminError(error);
        if (errorResult.shouldLockSession) {
          lock();
        }
        throw new Error(errorResult.userMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobVacancies'] });
    },
  });
}

export function useUpdateJobVacancy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { lock } = useAdminPassword();

  return useMutation({
    mutationFn: async ({ jobId, vacancy }: { jobId: bigint; vacancy: JobVacancy }) => {
      if (!actor) throw new Error('System not ready. Please try again.');

      try {
        return await actor.updateJobVacancy(jobId, vacancy);
      } catch (error: any) {
        const errorResult = formatAdminError(error);
        if (errorResult.shouldLockSession) {
          lock();
        }
        throw new Error(errorResult.userMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobVacancies'] });
    },
  });
}

export function useDeleteJobVacancy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { lock } = useAdminPassword();

  return useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('System not ready. Please try again.');

      try {
        return await actor.deleteJobVacancy(jobId);
      } catch (error: any) {
        const errorResult = formatAdminError(error);
        if (errorResult.shouldLockSession) {
          lock();
        }
        throw new Error(errorResult.userMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobVacancies'] });
    },
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { lock } = useAdminPassword();

  return useMutation({
    mutationFn: async ({ title, content, image }: { title: string; content: string; image: ExternalBlob | null }) => {
      if (!actor) throw new Error('System not ready. Please try again.');

      try {
        return await actor.createPost(title, content, image);
      } catch (error: any) {
        const errorResult = formatAdminError(error);
        if (errorResult.shouldLockSession) {
          lock();
        }
        throw new Error(errorResult.userMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { lock } = useAdminPassword();

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
      if (!actor) throw new Error('System not ready. Please try again.');

      try {
        return await actor.updatePost(postId, title, content, image);
      } catch (error: any) {
        const errorResult = formatAdminError(error);
        if (errorResult.shouldLockSession) {
          lock();
        }
        throw new Error(errorResult.userMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { lock } = useAdminPassword();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('System not ready. Please try again.');

      try {
        return await actor.deletePost(postId);
      } catch (error: any) {
        const errorResult = formatAdminError(error);
        if (errorResult.shouldLockSession) {
          lock();
        }
        throw new Error(errorResult.userMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
