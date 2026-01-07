'use client'

import { Dialog } from "@/src/components/ui/dialog";
import { CreateGoal } from "@/src/components/app/create-goal";
import { EmptyGoals } from "@/src/components/app/empty-goals";
import { Summary } from "@/src/components/app/summary";
import { useSummary, usePendingGoals } from "@/src/hooks/use-summary";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const { data: summaryData, isLoading: isLoadingSummary } = useSummary();
  const { data: pendingData } = usePendingGoals();
  

  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);

  if (isLoadingSummary) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="text-zinc-500 animate-spin size-10" />
      </div>
    );
  }

  return (

    <Dialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen}>
      
      {summaryData?.summary.total && summaryData.summary.total > 0 ? (
        <Summary 
            summary={summaryData.summary} 
            pendingGoals={pendingData?.pendingGoals || []} 
        />
      ) : (
        <EmptyGoals />
      )}

    
      <CreateGoal onClose={() => setIsCreateGoalOpen(false)} />
      
    </Dialog>
  );
}