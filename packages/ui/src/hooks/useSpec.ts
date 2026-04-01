import { useQuery } from '@tanstack/react-query';
import { fetchSpec } from '@/api/client';

export function useSpec() {
  return useQuery({
    queryKey: ['spec'],
    queryFn: fetchSpec,
    staleTime: Infinity,
  });
}
