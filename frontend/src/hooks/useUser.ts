import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { College } from './useColleges';

export function useSavedColleges(token?: string) {
  return useQuery<College[]>({
    queryKey: ['saved-colleges'],
    queryFn: () =>
      apiFetch<College[]>('/user/saved', {
        token,
      }),
    enabled: !!token,
  });
}

export function useSaveCollegeAction() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { collegeId: number; token: string }>({
    mutationFn: ({ collegeId, token }) =>
      apiFetch<{ success: boolean }>('/user/saved', {
        method: 'POST',
        token,
        body: JSON.stringify({ collegeId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-colleges'] });
    },
  });
}

export function useUnsaveCollegeAction() {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error, { collegeId: number; token: string }>({
    mutationFn: ({ collegeId, token }) =>
      apiFetch<{ success: boolean }>(`/user/saved/${collegeId}`, {
        method: 'DELETE',
        token,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-colleges'] });
    },
  });
}
