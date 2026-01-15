import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingHeader } from "@/components/floating-header"; // <--- Importe aqui

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-pink-500/30">
      
      {/* --- NOVA HEADER FLUTUANTE --- */}
      <FloatingHeader />

      <main>
        {/* --- HERO SECTION (Adicionei id="hero") --- */}
        <section id="hero" className="relative py-32 md:py-40 overflow-hidden">
          {/* ... (Conteúdo do Hero mantém igual) ... */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-[#F472B6] to-[#8B5CF6] rounded-full blur-[120px] opacity-20 pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
              </span>
              Novidade: Metas compartilhadas em breve
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400">
              Tudo que você precisa para <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F472B6] to-[#8B5CF6]">
                alcançar suas metas
              </span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
              O Axis ajuda você a organizar, rastrear e conquistar seus objetivos com uma interface simples, poderosa e desenhada para o seu sucesso.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link href="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 px-8 text-lg bg-gradient-to-r from-[#F472B6] to-[#8B5CF6] hover:opacity-90 transition-all border-0 shadow-[0_0_20px_rgba(244,114,182,0.3)] hover:shadow-[0_0_30px_rgba(244,114,182,0.5)]">
                  Começar Gratuitamente <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Link href="#features" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300">
                  Saber mais
                </Button>
              </Link>
            </div>

            {/* Stats simples */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 border-t border-zinc-800 pt-8 w-full max-w-4xl">
              {[
                { label: "Usuários Ativos", value: "50k+" },
                { label: "Metas Concluídas", value: "2M+" },
                { label: "Satisfação", value: "98%" },
                { label: "Avaliação", value: "4.9/5" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                  <span className="text-sm text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FEATURES GRID (Mantive o id="features") --- */}
        <section id="features" className="py-20 bg-zinc-900/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Recursos pensados para você</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Ferramentas essenciais para transformar grandes sonhos em passos diários realizáveis.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Zap,
                  title: "Metas Instantâneas",
                  desc: "Crie e gerencie metas em segundos com nossa interface intuitiva e rápida."
                },
                {
                  icon: BarChart3,
                  title: "Monitoramento Diário",
                  desc: "Visualize seu progresso com gráficos claros e relatórios de desempenho semanais."
                },
                {
                  icon: ShieldCheck,
                  title: "Foco Total",
                  desc: "Sem distrações. O Axis foi desenhado para manter você focado no que importa."
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all hover:-translate-y-1">
                  <div className="size-12 rounded-lg bg-zinc-900 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br from-[#F472B6]/20 to-[#8B5CF6]/20 transition-colors">
                    <feature.icon className="size-6 text-[#F472B6] group-hover:text-[#8B5CF6] transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simples de usar, poderoso nos resultados</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { number: "01", title: "Defina suas metas", desc: "Escolha o que você quer conquistar e a frequência semanal desejada." },
                { number: "02", title: "Acompanhe diariamente", desc: "Marque suas conquistas e veja sua barra de progresso encher." },
                { number: "03", title: "Analise sua evolução", desc: "Receba insights sobre seus hábitos e melhore constantemente." }
              ].map((step, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <span className="text-6xl font-bold text-zinc-800/50 mb-4 select-none absolute -top-8 -z-10">
                    {step.number}
                  </span>
                  <h3 className="text-2xl font-bold mb-3 relative z-10">{step.title}</h3>
                  <p className="text-zinc-400 max-w-sm">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-16 flex justify-center">
              <Link href="/login">
                <Button className="h-12 rounded-full px-8 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-lg">
                  Começar minha jornada
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- FAQ SECTION (Adicionei id="faq") --- */}
        <section id="faq" className="py-20 md:py-32 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-[#F472B6]/5 pointer-events-none" />
           
           <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
             <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para transformar sua rotina?</h2>
             <p className="text-zinc-400 max-w-2xl mx-auto mb-10 text-lg">
               Junte-se a milhares de pessoas que já estão alcançando seus objetivos com o Axis.
             </p>
             <Link href="/register">
                <Button className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-[#F472B6] to-[#8B5CF6] hover:scale-105 transition-transform border-0 shadow-lg shadow-purple-500/20">
                  Criar conta gratuitamente
                </Button>
             </Link>
             <p className="mt-4 text-sm text-zinc-500">Não requer cartão de crédito • Cancelamento a qualquer momento</p>
           </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded bg-gradient-to-br from-[#F472B6] to-[#8B5CF6] flex items-center justify-center font-bold text-white text-xs">
              A
            </div>
            <span className="font-semibold text-zinc-300">Axis</span>
          </div>
          
          <div className="flex gap-8 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>

          <div className="text-sm text-zinc-600">
            © {new Date().getFullYear()} Axis Inc. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}