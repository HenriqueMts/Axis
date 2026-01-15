import { auth } from "@/auth"; 
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client"; // Importa o arquivo do Passo 1

export default async function DashboardPage() {

  const session = await auth();

 
  if (!session?.user) {
    redirect("/login");
  }

 
  return (
    <DashboardClient 
        user={{
            name: session.user.name,
            image: session.user.image,
        }} 
    />
  );
}