import { CheckCircle2, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PendingGoal, SummaryData } from "@/types/api-responses"; 
import { Progress, ProgressIndicator } from "@/components/ui/progress-bar";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";
import { useQueryClient, useMutation } from "@tanstack/react-query"; 
import { createGoalCompletionAction } from "@/app/actions/goals"; 

dayjs.locale(ptBR);

interface SummaryProps {
  summary: SummaryData;
  pendingGoals: PendingGoal[];
  onAddGoal: () => void;
}

export function Summary({ summary, pendingGoals, onAddGoal }: Readonly<SummaryProps>) {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: createGoalCompletionAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
    }
  });

  const completedPercentage = summary.total > 0 
    ? Math.round((summary.completed / summary.total) * 100) 
    : 0;

  
  const goalsCompletedToday = new Set(
    Object.values(summary.goalsPerDay || {})
      .flat()
      .filter((completion) => dayjs(completion.completedAt).isSame(dayjs(), 'day'))
      .map((completion) => completion.goalId) 
  );

  function handleCompleteGoal(goalId: string) {
    mutate(goalId);
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 w-full"> 
      
      {/* --- CABEÇALHO DA LISTA --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-base sm:text-lg font-semibold capitalize">
            {dayjs().format("DD [de] MMMM")}
          </span>
        </div>

        <Button size="sm" onClick={onAddGoal} className="w-full sm:w-auto">
          <Plus className="size-4" /> 
          <span className="hidden xs:inline">Cadastrar Meta</span>
          <span className="inline xs:hidden">Meta</span>
        </Button>
      </div>

      {/* --- BARRA DE PROGRESSO --- */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <Progress value={summary.completed} max={summary.total}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-zinc-400">
          <span>
            Você completou <span className="text-zinc-100">{summary.completed}</span> das{" "}
            <span className="text-zinc-100">{summary.total}</span> ações planejadas.
          </span>
          <span className="text-zinc-100 font-medium">{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

      {/* --- LISTA DE METAS PENDENTES --- */}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {pendingGoals.map((goal) => {
          // AQUI ESTAVA O ERRO: Definindo a variável dentro do map
          const isCompletedToday = goalsCompletedToday.has(goal.id);
          const isDisabled = goal.completionCount >= goal.desiredWeeklyFrequency || isCompletedToday;

          return (
            <Button
              key={goal.id}
              onClick={() => handleCompleteGoal(goal.id)}
              disabled={isDisabled}
              variant="outline"
              className={cn(
                "group transition-all duration-300 ease-in-out text-xs sm:text-sm",
                // Agora 'isCompletedToday' existe neste escopo
                isCompletedToday 
                  ? "disabled:bg-emerald-950/30 disabled:border-emerald-900 disabled:text-emerald-400 disabled:opacity-100" 
                  : "disabled:bg-zinc-900 disabled:text-zinc-500 disabled:border-zinc-800 disabled:opacity-50" 
              )}
            >
              <div className={`transition-transform duration-300 mr-2 flex items-center justify-center ${isCompletedToday ? 'rotate-0' : 'rotate-90'}`}>
                {isCompletedToday ? <Check className="size-4 text-emerald-500" /> : <Plus className="size-4 text-zinc-400 group-disabled:text-zinc-600" />}
              </div>
              <span className="truncate max-w-xs sm:max-w-50">{goal.title}</span>
              {isCompletedToday && <span className="text-xs ml-1 sm:ml-2 text-emerald-500 opacity-70 hidden sm:inline-block">(Completo)</span>}
            </Button>
          );
        })}
      </div>

      {/* --- HISTÓRICO DA SEMANA --- */}
      <div className="flex flex-col gap-4 sm:gap-6">
        <h2 className="text-lg sm:text-xl font-medium">Sua semana</h2>
        {summary.goalsPerDay && Object.keys(summary.goalsPerDay).length > 0 ? (
          Object.entries(summary.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format("dddd");
            const formattedDate = dayjs(date).format("DD [de] MMMM");

            return (
              <div key={date} className="flex flex-col gap-3 sm:gap-4">
                <h3 className="font-medium text-sm sm:text-base">
                  <span className="capitalize">{weekDay}</span>{" "}
                  <span className="text-zinc-400 text-xs sm:text-sm">({formattedDate})</span>
                </h3>
                <ul className="flex flex-col gap-2 sm:gap-3">
                  {goals.map((goal) => {
                     const time = dayjs(goal.completedAt).format("HH:mm");
                     return (
                        <li key={goal.id} className="flex items-start sm:items-center gap-2">
                           <CheckCircle2 className="size-4 text-pink-500 shrink-0 mt-0.5 sm:mt-0" />
                           <span className="text-xs sm:text-sm text-zinc-400 leading-tight sm:leading-normal">
                             Você completou "<span className="text-zinc-100">{goal.title}</span>" às <span className="text-zinc-100">{time}h</span>
                           </span>
                        </li>
                     );
                  })}
                </ul>
              </div>
            );
          })
        ) : (
           <p className="text-xs sm:text-sm text-zinc-500">Nenhuma meta completada ainda.</p>
        )}
      </div>
    </div>
  );
}