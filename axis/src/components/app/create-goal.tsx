import { X } from "lucide-react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from "@/src/components/ui/radio-group";
import { Button } from "@/src/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGoal } from "@/src/http/api-client";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

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

  const { mutateAsync } = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
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
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar Meta</DialogTitle>
            <DialogClose onClick={onClose}>
              <X className="size-5 text-zinc-600" />
            </DialogClose>
          </div>
          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit(handleCreateGoal)} className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Qual a atividade?</Label>
              <Input
                id="title"
                autoFocus
                placeholder="Praticar exercícios, meditar, etc..."
                {...register("title")}
              />
              {errors.title && (
                <span className="text-red-400 text-xs">{errors.title.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Quantas vezes na semana?</Label>
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
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          {item.label}
                        </span>
                        <span className="text-lg leading-none">{item.emoji}</span>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" className="flex-1" variant="secondary" onClick={onClose}>
              Fechar
            </Button>
            
            <Button className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}