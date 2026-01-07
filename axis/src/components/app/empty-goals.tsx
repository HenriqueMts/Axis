import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { DialogTrigger } from "@/src/components/ui/dialog";

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <Image src="/axis-logo.svg" alt="Axis Logo" width={114} height={36} />
      <Image
        src="/axis-background.svg" 
        alt="Ilustração de uma mulher controlando um lançamento de foguete"
        width={320}
        height={320}
      />
      <p className="text-zinc-300 leading-relaxed max-w-80 text-center">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
      </p>

      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" /> Cadastrar Meta
        </Button>
      </DialogTrigger>
    </div>
  );
}
