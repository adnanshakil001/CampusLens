import { useQuery, useMutation } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface PredictionResult {
  id: number;
  college_id: number;
  exam: string;
  rank_cutoff: number;
  category: string;
  branch: string;
  quota: string;
  year: number;
  college_name: string;
  college_slug: string;
  location: string;
  fees: number;
  rating: number | string;
  logo_url?: string;
  chance: 'Safe' | 'Target' | 'Reach';
}

export function usePredictorExams() {
  return useQuery<string[]>({
    queryKey: ['predictor-exams'],
    queryFn: () => apiFetch<string[]>('/predictor/exams'),
  });
}

export function usePredictColleges() {
  return useMutation<
    PredictionResult[],
    Error,
    { exam: string; rank: number; category: string; quota?: string }
  >({
    mutationFn: (body) =>
      apiFetch<PredictionResult[]>('/predictor', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  });
}
