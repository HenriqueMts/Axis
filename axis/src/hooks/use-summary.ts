import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSummaryAction, getPendingGoalsAction } from "@/app/actions/goals"; // Importe as actions


export function useSummary() {
  return useQuery({
    queryKey: ['summary'],
    queryFn: async () => {

      const data = await getSummaryAction();

      return { summary: data };
    },
    staleTime: 1000 * 60,
  });
}


export function usePendingGoals() {
  return useQuery({
    queryKey: ['pending-goals'],
    queryFn: async () => {
      const data = await getPendingGoalsAction();
      return { pendingGoals: data };
    },
    staleTime: 1000 * 60,
  });
}
