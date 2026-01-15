import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

export function EmptyGoals() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <Image src="/axis-logo.svg" alt="Axis Logo" width={114} height={36} className="w-24 sm:w-28 md:w-32 h-auto" />
      <Image
        src="/axis-background.svg" 
        alt="Ilustração de uma mulher controlando um lançamento de foguete"
        width={320}
        height={320}
        className="w-48 sm:w-64 md:w-80 h-auto max-w-full"
      />
      <p className="text-zinc-300 leading-relaxed max-w-xs sm:max-w-sm md:max-w-md text-center text-sm sm:text-base">
        Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
      </p>

      <DialogTrigger asChild>
        <Button className="text-sm sm:text-base">
          <Plus className="size-4" /> Cadastrar Meta
        </Button>
      </DialogTrigger>
    </div>
  );
}
