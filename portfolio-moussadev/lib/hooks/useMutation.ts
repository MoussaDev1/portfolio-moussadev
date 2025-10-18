import { useState } from "react";

export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: UseMutationOptions<TData, TVariables>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<TData | null>(null);

  const mutate = async (variables: TVariables): Promise<TData> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(variables);
      setData(result);
      options?.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Mutation failed");
      setError(error);
      options?.onError?.(error, variables);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    mutate,
    loading,
    error,
    data,
    reset,
  };
}
