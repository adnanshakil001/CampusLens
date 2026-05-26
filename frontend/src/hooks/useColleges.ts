import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export interface College {
  id: number;
  name: string;
  slug: string;
  location: string;
  state: string;
  city: string;
  type: string;
  fees: number;
  rating: number | string;
  logo_url?: string;
  cover_url?: string;
  overview: string;
  established?: number;
  ranking?: number;
}

export interface CollegeFilters {
  search?: string;
  state?: string;
  city?: string;
  type?: string;
  minFees?: number;
  maxFees?: number;
  minRating?: number;
  exam?: string;
  rank?: number;
}

export function useColleges(filters: CollegeFilters = {}) {
  return useQuery<College[]>({
    queryKey: ['colleges', filters],
    queryFn: () =>
      apiFetch<College[]>('/colleges', {
        params: {
          search: filters.search || undefined,
          state: filters.state || undefined,
          city: filters.city || undefined,
          type: filters.type || undefined,
          minFees: filters.minFees || undefined,
          maxFees: filters.maxFees || undefined,
          minRating: filters.minRating || undefined,
          exam: filters.exam || undefined,
          rank: filters.rank || undefined,
        },
      }),
  });
}
