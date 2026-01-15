import { X } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";


import { createGoalAction } from "@/app/actions/goals";

const createGoalSchema = z.object({
  title: z.string().min(1, "Informe a atividade que deseja realizar"),
  desiredWeeklyFrequency: z.number().min(1).max(7),
});

type CreateGoalSchema = z.infer<typeof createGoalSchema>;

interface CreateGoalProps {
  onClose: () => void;
}

export function CreateGoal({ onClose }: Readonly<CreateGoalProps>) {
  const queryClient = useQueryClient();

  const { 
    register, 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitSuccessful }, 
    reset 
  } = useForm<CreateGoalSchema>({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      desiredWeeklyFrequency: 1 
    }
  });

  const { mutateAsync, isPending } = useMutation({ // Troquei isLoading por isPending (versões novas do React Query)
    // AQUI ESTÁ A MÁGICA: Chamamos a Server Action
    mutationFn: async (data: CreateGoalSchema) => {
        await createGoalAction(data);
    },
    onSuccess: () => {
      // Invalidamos as queries para atualizar a tela
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
    }
  });

  async function handleCreateGoal(data: CreateGoalSchema) {
    await mutateAsync(data);
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      onClose();
      reset();
    }
  }, [isSubmitSuccessful, onClose, reset]);

  return (
    <DialogContent>
      <div className="flex flex-col gap-4 sm:gap-6 h-full">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="text-lg sm:text-xl">Cadastrar Meta</DialogTitle>
            <DialogClose onClick={onClose}>
              <X className="size-4 sm:size-5 text-zinc-600" />
            </DialogClose>
          </div>
          <DialogDescription className="text-xs sm:text-sm">
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit(handleCreateGoal)} className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <Label htmlFor="title" className="text-xs sm:text-sm">Qual a atividade?</Label>
              <Input
                id="title"
                autoFocus
                placeholder="Praticar exercícios, meditar, etc..."
                className="text-sm"
                {...register("title")}
              />
              {errors.title && (
                <span className="text-red-400 text-xs">{errors.title.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <Label className="text-xs sm:text-sm">Quantas vezes na semana?</Label>
              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={1} 
                render={({ field }) => (
                  <RadioGroup 
                    value={String(field.value)} 
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    {[
                      { value: "1", label: "1x na semana", emoji: "🥱" },
                      { value: "2", label: "2x na semana", emoji: "🙂" },
                      { value: "3", label: "3x na semana", emoji: "😁" },
                      { value: "4", label: "4x na semana", emoji: "🤩" },
                      { value: "5", label: "5x na semana", emoji: "😎" },
                      { value: "6", label: "6x na semana", emoji: "🥳" },
                      { value: "7", label: "Todos os dias", emoji: "🚀" },
                    ].map((item) => (
                      <RadioGroupItem key={item.value} value={item.value}>
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-xs sm:text-sm font-medium leading-none">
                          {item.label}
                        </span>
                        <span className="text-base sm:text-lg leading-none">{item.emoji}</span>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <Button type="button" className="w-full sm:flex-1" variant="secondary" onClick={onClose}>
              Fechar
            </Button>
            
            {/* Adicionei disabled={isPending} para evitar clique duplo */}
            <Button className="w-full sm:flex-1" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}