'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignInGitHub, SignInGoogle } from '@/components/ui/auth-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { loginWithCredentialsAction } from '@/app/actions/login'; // Action do passo 2

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await loginWithCredentialsAction({ email, password });

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      // Se deu certo, redireciona para o dashboard
      router.refresh(); // Atualiza o cache do cliente
      router.push('/'); 
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-xs sm:max-w-[400px] md:max-w-[450px] space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
           {/* Logo ou Ícone */}
          <div className="size-10 sm:size-12 md:size-14 bg-white rounded-xl flex items-center justify-center mb-1 sm:mb-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
             <span className="font-bold text-black text-xl sm:text-2xl md:text-3xl">A</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Bem-vindo de volta
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm md:text-base">
            Entre na sua conta para continuar.
          </p>
        </div>

        {/* --- FORMULÁRIO --- */}
        <div className="flex flex-col gap-5 sm:gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col gap-1.5 sm:gap-2">
                    <Label htmlFor="email" className="text-zinc-300 text-xs sm:text-sm">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 text-white placeholder:text-zinc-600 text-sm"
                    />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                    <Label htmlFor="password" className="text-zinc-300 text-xs sm:text-sm">Senha</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 text-white placeholder:text-zinc-600 text-sm"
                    />
                </div>

                {error && (
                    <div className="flex items-start gap-2 text-red-400 text-xs sm:text-sm bg-red-500/10 p-2.5 sm:p-3 rounded-lg border border-red-500/20">
                        <AlertCircle className="size-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black hover:bg-zinc-200 font-medium text-sm sm:text-base h-10 sm:h-11 md:h-12 mt-2 transition-all"
                >
                    {isLoading ? <Loader2 className="animate-spin size-4" /> : (
                         <span className="flex items-center gap-2">
                            Entrar <ArrowRight className="size-4" />
                        </span>
                    )}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="bg-zinc-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-black px-2 text-zinc-500 text-xs">Ou entre com</span>
                </div>
            </div>

            <div className="flex flex-col gap-2.5 sm:gap-3">
                <SignInGitHub />
                <SignInGoogle />
            </div>

            <p className="text-center text-xs sm:text-sm text-zinc-500">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-white hover:underline underline-offset-4 font-medium transition-colors">
                    Criar conta
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
}