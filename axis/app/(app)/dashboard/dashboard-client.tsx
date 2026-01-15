'use client'

import { useState } from "react";
import { Loader2, LogOut, User } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateGoal } from "@/components/create-goal";
import { EmptyGoals } from "@/components/empty-goals";
import { Summary } from "@/components/summary";
import { useSummary, usePendingGoals } from "@/hooks/use-summary";
import { logoutAction } from "@/app/actions"; 

interface DashboardClientProps {
  user: {
    name?: string | null;
    image?: string | null;
  }
}

export function DashboardClient({ user }: Readonly<DashboardClientProps>) {
  const { data: summaryData, isLoading: isLoadingSummary } = useSummary();
  const { data: pendingData } = usePendingGoals();
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);

  const firstName = user.name?.split(' ')[0] ?? "";

  if (isLoadingSummary) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="text-zinc-500 animate-spin size-8 sm:size-10" />
      </div>
    );
  }

  return (
    <Dialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen}>
      
     
      <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl mx-auto py-6 sm:py-8 md:py-10 px-3 sm:px-4 md:px-6 flex flex-col gap-6 sm:gap-8">
        
   
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
              {user.image ? (
                  <img src={user.image} alt="Perfil" className="size-9 sm:size-10 rounded-full border border-zinc-800 object-cover" />
              ) : (
                  <div className="size-9 sm:size-10 bg-zinc-950 rounded-full flex items-center justify-center border border-zinc-800">
                      <User className="size-4 sm:size-5 text-zinc-500" />
                  </div>
              )}
              
              <div className="flex flex-col">
                  <span className="text-xs text-zinc-400">Olá,</span>
                  <span className="font-semibold text-zinc-100 leading-tight text-sm">{firstName}</span>
              </div>
          </div>

          <Button 
              variant="outline" 
              size="sm" 
              className="text-zinc-400 border-zinc-800 hover:bg-zinc-900 hover:text-zinc-100 transition-colors text-xs sm:text-sm w-full sm:w-auto"
              onClick={() => logoutAction()}
          >
              <LogOut className="size-3 mr-1 sm:mr-2" />
              Sair
          </Button>
        </div>

     
       {summaryData?.summary?.total && summaryData.summary.total > 0 ? ( <Summary summary={summaryData.summary} pendingGoals={pendingData?.pendingGoals || []} onAddGoal={function (): void {
                  throw new Error("Function not implemented.");
              } } /> ) : ( <EmptyGoals /> )}

        <CreateGoal onClose={() => setIsCreateGoalOpen(false)} />
        
      </div>
    </Dialog>
  );
}