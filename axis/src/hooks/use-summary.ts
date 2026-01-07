import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPendingGoals,
  getWeekSummary,
  createGoalCompletion,
} from "../http/api-client";

export function useSummary() {
  return useQuery({
    queryKey: ["summary"],
    queryFn: getWeekSummary,
    staleTime: 1000 * 60,
  });
}

export function usePendingGoals() {
  return useQuery({
    queryKey: ["pending-goals"],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60,
  });
}


export function useCreateGoalCompletion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoalCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["summary"] });
      queryClient.invalidateQueries({ queryKey: ["pending-goals"] });
    },
  });
}
