export interface PendingGoal {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
}

export interface SummaryData {
  completed: number;
  total: number;
  goalsPerDay: Record<string, {
    id: string;
    title: string;
    completedAt: string;
  }[]> | null;
}

export interface PendingGoalsResponse {
  pendingGoals: PendingGoal[];
}

export interface SummaryResponse {
  summary: SummaryData;
}
