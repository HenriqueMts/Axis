import { CheckCircle2, Plus, Check } from "lucide-react";
import { DialogTrigger } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { PendingGoal, SummaryData } from "@/src/types/api-responses";
import { Progress, ProgressIndicator } from "@/src/components/ui/progress-bar";
import { useCreateGoalCompletion } from "@/src/hooks/use-summary";
import { cn } from "@/src/lib/utils";
import dayjs from "dayjs";
import ptBR from "dayjs/locale/pt-br";

dayjs.locale(ptBR);

interface SummaryProps {
  summary: SummaryData;
  pendingGoals: PendingGoal[];
}

export function Summary({ summary, pendingGoals }: Readonly<SummaryProps>) {
  const queryClient = useCreateGoalCompletion();

  const completedPercentage = summary.total > 0 
    ? Math.round((summary.completed / summary.total) * 100) 
    : 0;

 
  const currentDayKey = dayjs().format("YYYY-MM-DD");
  const goalsCompletedToday = new Set(
    summary.goalsPerDay?.[currentDayKey]?.map(completion => completion.id) || []
  );

  function handleCompleteGoal(goalId: string) {
    queryClient.mutate(goalId);
  }

  return (
    <div className="py-10 max-w-xl mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold capitalize">
            {dayjs().format("DD [de] MMMM")}
          </span>
        </div>

        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className="size-4" /> Cadastrar Meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress value={summary.completed} max={summary.total}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>
        
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou <span className="text-zinc-100">{summary.completed}</span> das{" "}
            <span className="text-zinc-100">{summary.total}</span> ações planejadas.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />

     
      <div className="flex flex-wrap gap-3">
        {pendingGoals.map((goal) => {
  
          const isCompletedToday = goalsCompletedToday.has(goal.id);
          
      
          const isDisabled = 
            goal.completionCount >= goal.desiredWeeklyFrequency || 
            isCompletedToday;

          return (
         <Button
              key={goal.id}
              onClick={() => handleCompleteGoal(goal.id)}
              disabled={isDisabled}
              variant="outline"
              className={cn(
                "group transition-ease",
               
                isCompletedToday 
                  ? "disabled:bg-emerald-950/30 disabled:border-emerald-900 disabled:text-emerald-400 disabled:opacity-100" 
                  : "disabled:bg-zinc-900 disabled:text-zinc-500 disabled:border-zinc-800 disabled:opacity-50" 
              )}
            >
              
              <div className={`transition-transform duration-300 ${isCompletedToday ? 'rotate-0' : 'rotate-90'}`}>
              {isCompletedToday ? (
                  <Check className="size-4 text-emerald-500" />
                ) : (
                  <Plus className="size-4 text-zinc-400 group-disabled:text-zinc-600" />
                )}
              </div>
              
              {goal.title}

       
              {isCompletedToday && <span className="text-xs ml-1 text-emerald-500 opacity-70">(Completo por hoje.)</span>}
            </Button>
          );
        })}
      </div>


      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua semana</h2>
        {summary.goalsPerDay ? (
          Object.entries(summary.goalsPerDay).map(([date, goals]) => {
            const weekDay = dayjs(date).format("dddd");
            const formattedDate = dayjs(date).format("DD [de] MMMM");

            return (
              <div key={date} className="flex flex-col gap-4">
                <h3 className="font-medium">
                  <span className="capitalize">{weekDay}</span>{" "}
                  <span className="text-zinc-400 text-xs">({formattedDate})</span>
                </h3>
                <ul className="flex flex-col gap-3">
                  {goals.map((goal) => {
                     const time = dayjs(goal.completedAt).format("HH:mm");
                     return (
                        <li key={goal.id} className="flex items-center gap-2">
                           <CheckCircle2 className="size-4 text-pink-500" />
                           <span className="text-sm text-zinc-400">
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
           <p className="text-sm text-zinc-500">Nenhuma meta completada ainda.</p>
        )}
      </div>
    </div>
  );
}