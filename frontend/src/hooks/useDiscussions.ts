import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface Question {
  id: number;
  user_id?: number;
  user_name: string;
  title: string;
  content: string;
  views: number;
  answers_count: number;
  votes_score: number;
  created_at: string;
}

export interface Answer {
  id: number;
  question_id: number;
  user_id?: number;
  user_name: string;
  content: string;
  votes_score: number;
  created_at: string;
}

export function useQuestions() {
  return useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: () => apiFetch<Question[]>('/discussions'),
  });
}

export function useQuestionDetail(id: number) {
  return useQuery<{ question: Question; answers: Answer[] }>({
    queryKey: ['question', id],
    queryFn: () => apiFetch<{ question: Question; answers: Answer[] }>(`/discussions/${id}`),
    enabled: !isNaN(id),
  });
}

export function useCreateQuestion() {
  const queryClient = useQueryClient();

  return useMutation<
    Question,
    Error,
    { title: string; content: string; token: string }
  >({
    mutationFn: ({ title, content, token }) =>
      apiFetch<Question>('/discussions', {
        method: 'POST',
        token,
        body: JSON.stringify({ title, content }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useCreateAnswer(questionId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    Answer,
    Error,
    { content: string; token: string }
  >({
    mutationFn: ({ content, token }) =>
      apiFetch<Answer>(`/discussions/${questionId}/answers`, {
        method: 'POST',
        token,
        body: JSON.stringify({ content }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
    },
  });
}

export function useVoteQuestion(questionId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { voteType: 'up' | 'down'; token: string }
  >({
    mutationFn: ({ voteType, token }) =>
      apiFetch<{ success: boolean }>(`/discussions/${questionId}/vote`, {
        method: 'POST',
        token,
        body: JSON.stringify({ voteType }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
    },
  });
}

export function useVoteAnswer(questionId: number, answerId: number) {
  const queryClient = useQueryClient();

  return useMutation<
    { success: boolean },
    Error,
    { voteType: 'up' | 'down'; token: string }
  >({
    mutationFn: ({ voteType, token }) =>
      apiFetch<{ success: boolean }>(`/discussions/answers/${answerId}/vote`, {
        method: 'POST',
        token,
        body: JSON.stringify({ voteType }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question', questionId] });
    },
  });
}
