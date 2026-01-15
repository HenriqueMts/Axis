'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SignInGitHub, SignInGoogle } from '@/components/ui/auth-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { registerAction } from "@/app/actions/register";
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    setIsLoading(true);
    
    
    const result = await registerAction({
        name: formData.name,
        email: formData.email,
        password: formData.password
    });

    setIsLoading(false);

    if (result.error) {
        setError(result.error);
    } else {
        setSuccess(true);
       
        setTimeout(() => router.push('/login'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-xs sm:max-w-[400px] md:max-w-[450px] space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        

        <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
          <div className="size-10 sm:size-12 md:size-14  rounded-xl flex items-center justify-center mb-1 sm:mb-2 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <Image src="/axis-icon.svg" alt="Logo" width={40} height={40} />
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-white">
            Crie sua conta
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm md:text-base">
            Junte-se ao Axis e controle suas metas.
          </p>
        </div>

        {/* --- CONTEÚDO --- */}
        {success ? (
             <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-6 sm:p-8 flex flex-col items-center gap-3 sm:gap-4 text-center animate-in zoom-in-95">
                <div className="size-12 sm:size-14 bg-emerald-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="size-6 sm:size-7 text-emerald-500" />
                </div>
                <div>
                    <h3 className="text-white font-medium text-base sm:text-lg">Sucesso!</h3>
                    <p className="text-zinc-400 text-xs sm:text-sm mt-1">Sua conta foi criada.</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 mt-3 sm:mt-4">
                    Redirecionando <Loader2 className="size-3 animate-spin" />
                </div>
             </div>
        ) : (
            <div className="flex flex-col gap-5 sm:gap-6">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                        <Label htmlFor="name" className="text-zinc-300 text-xs sm:text-sm">Nome completo</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Seu nome"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 text-white placeholder:text-zinc-600 text-sm"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:gap-2">
                        <Label htmlFor="email" className="text-zinc-300 text-xs sm:text-sm">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 text-white placeholder:text-zinc-600 text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <Label htmlFor="password" className="text-zinc-300 text-xs sm:text-sm">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="******"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 text-white placeholder:text-zinc-600 text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5 sm:gap-2">
                            <Label htmlFor="confirmPassword" className="text-zinc-300 text-xs sm:text-sm">Confirmar</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                placeholder="******"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-zinc-700 text-white placeholder:text-zinc-600 text-sm"
                            />
                        </div>
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
                                Criar conta <ArrowRight className="size-4" />
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
                    Já tem uma conta?{' '}
                    <Link href="/login" className="text-white hover:underline underline-offset-4 font-medium transition-colors">
                        Entrar
                    </Link>
                </p>
            </div>
        )}
      </div>
    </div>
  );
}