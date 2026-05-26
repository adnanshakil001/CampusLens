import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { College } from './useColleges';
import { Placement } from './useCollege';

export interface ComparisonCollege extends College {
  latestPlacement: Placement | null;
  coursesCount: number;
}

export function useCompareColleges(ids: number[]) {
  return useQuery<ComparisonCollege[]>({
    queryKey: ['compare', ids],
    queryFn: () =>
      apiFetch<ComparisonCollege[]>('/compare', {
        params: {
          ids: ids.join(','),
        },
      }),
    enabled: ids.length > 0,
  });
}
