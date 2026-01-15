import { loginWithGithub, loginWithGoogle, logoutAction } from "@/app/actions";
import { Github, LogOut } from "lucide-react"; // Importe o ícone do GitHub

export function SignInGitHub() {
  return (
    <form action={loginWithGithub}>
      <button 
        type="submit" 
        className="w-full h-10 sm:h-11 md:h-12 bg-[#24292F] hover:bg-[#24292F]/90 text-white text-sm sm:text-base flex items-center justify-center gap-2 rounded-md font-medium transition-colors"
      >
        <Github className="size-4" />
        <span className="hidden xs:inline">Entrar com GitHub</span>
        <span className="inline xs:hidden">GitHub</span>
      </button>
    </form>
  );
}

export function SignInGoogle() {
  return (
    <form action={loginWithGoogle}>
      <button 
        type="submit" 
        className="w-full h-10 sm:h-11 md:h-12 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-200 text-sm sm:text-base flex items-center justify-center gap-2 rounded-md font-medium transition-colors"
      >
        {/* SVG Oficial do Google */}
        <svg className="size-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <span className="hidden xs:inline">Entrar com Google</span>
        <span className="inline xs:hidden">Google</span>
      </button>
    </form>
  );
}

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="flex items-center text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
        <LogOut className="size-4 mr-2" />
        Sair da conta
      </button>
    </form>
  );
}