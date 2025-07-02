import { QueryClient } from '@tanstack/react-query';

const CACHE_TIME = 24 * 60 * 60 * 1000; // 1 day

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: CACHE_TIME,
      retry: 1,
    },
  },
});
