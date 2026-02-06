import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import type { Message } from '../../backend';
import type { Principal } from '@dfinity/principal';

export function useGetInbox() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['inbox'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getInbox();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSentMessages() {
  const { actor, isFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['sentMessages'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSentMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ receiver, content }: { receiver: Principal; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(receiver, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inbox'] });
      queryClient.invalidateQueries({ queryKey: ['sentMessages'] });
    },
  });
}
