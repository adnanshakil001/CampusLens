import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { College } from './useColleges';

export interface Course {
  id: number;
  college_id: number;
  name: string;
  duration: string;
  fees: number;
  level: string;
  intake?: number;
  eligibility?: string;
}

export interface Placement {
  id: number;
  college_id: number;
  year: number;
  highest_package: number | string;
  average_package: number | string;
  placement_percentage?: number | string;
  recruiters?: string[];
}

export interface Review {
  id: number;
  college_id: number;
  user_id?: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export function useCollege(slug: string) {
  return useQuery<College & { latestPlacement: Placement | null }>({
    queryKey: ['college', slug],
    queryFn: () => apiFetch<College & { latestPlacement: Placement | null }>(`/colleges/${slug}`),
  });
}

export function useCollegeCourses(slug: string) {
  return useQuery<Course[]>({
    queryKey: ['college-courses', slug],
    queryFn: () => apiFetch<Course[]>(`/colleges/${slug}/courses`),
  });
}

export function useCollegePlacements(slug: string) {
  return useQuery<Placement[]>({
    queryKey: ['college-placements', slug],
    queryFn: () => apiFetch<Placement[]>(`/colleges/${slug}/placements`),
  });
}

export function useCollegeReviews(slug: string) {
  return useQuery<Review[]>({
    queryKey: ['college-reviews', slug],
    queryFn: () => apiFetch<Review[]>(`/colleges/${slug}/reviews`),
  });
}

export function useCreateReview(slug: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Review,
    Error,
    { rating: number; comment: string; token: string }
  >({
    mutationFn: ({ rating, comment, token }) =>
      apiFetch<Review>(`/colleges/${slug}/reviews`, {
        method: 'POST',
        token,
        body: JSON.stringify({ rating, comment }),
      }),
    onSuccess: () => {
      // Invalidate review queries to refetch the fresh comments and updated average ratings
      queryClient.invalidateQueries({ queryKey: ['college', slug] });
      queryClient.invalidateQueries({ queryKey: ['college-reviews', slug] });
    },
  });
}
