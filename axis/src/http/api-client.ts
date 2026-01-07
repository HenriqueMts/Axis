import { PendingGoalsResponse, SummaryResponse } from "../types/api-responses";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function getPendingGoals(): Promise<PendingGoalsResponse> {
  const response = await fetch(`${API_URL}/pending-goals`);

  if (!response.ok) {
    throw new Error("Erro ao buscar metas pendentes");
  }

  return response.json();
}

export async function getWeekSummary(): Promise<SummaryResponse> {
  const response = await fetch(`${API_URL}/summary`);

  if (!response.ok) {
    throw new Error("Erro ao buscar resumo da semana");
  }

  return response.json();
}

export async function createGoalCompletion(goalId: string): Promise<void> {
  const response = await fetch(`${API_URL}/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ goalId }),
  });

  if (!response.ok) {
    throw new Error("Erro ao completar meta");
  }
}


interface CreateGoalRequest {
  title: string;
  desiredWeeklyFrequency: number;
}

export async function createGoal({ title, desiredWeeklyFrequency }: CreateGoalRequest) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      desiredWeeklyFrequency,
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao criar a meta')
  }
}
