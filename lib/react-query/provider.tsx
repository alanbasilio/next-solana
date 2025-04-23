'use client';
import { QueryClientProvider as QueryClientProviderPrimitive } from '@tanstack/react-query';
import { queryClient } from './query-client';

export const QueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <QueryClientProviderPrimitive client={queryClient}>
    {children}
  </QueryClientProviderPrimitive>
);
