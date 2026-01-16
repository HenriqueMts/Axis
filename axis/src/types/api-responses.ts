export interface PendingGoal {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
}


export type GoalCompletion = {
  id: string;
  title: string;
  completedAt: string;
  goalId: string;
};


export interface SummaryData {
  completed: number;
  total: number;
  goalsPerDay: Record<string, GoalCompletion[]> | null;
}

export interface PendingGoalsResponse {
  pendingGoals: PendingGoal[];
}

export interface SummaryResponse {
  summary: SummaryData;
}