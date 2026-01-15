"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Início", href: "#hero" },
  { label: "Funcionalidades", href: "#features" },
  { label: "FAQ", href: "#faq" },
];

export const FloatingHeader = () => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (href === "#hero") {
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
  };

  return (
    <nav
      className="
        fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50
        flex items-center justify-between
        w-[90%] sm:w-auto
        gap-4 sm:gap-8
        px-3 sm:px-4 py-2.5  /* Ajustei o padding do container para acomodar o botão maior */
        rounded-full
        border border-zinc-800
        bg-zinc-950/80 backdrop-blur-md
        shadow-[0_0_20px_rgba(0,0,0,0.5)]
        transition-all duration-300
      "
    >

      <div className="flex items-center gap-3 sm:gap-6 ml-2">
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleScroll(e, link.href)}
            className="
              text-xs sm:text-sm font-medium
              text-zinc-400 hover:text-white
              transition-all duration-300
              hover:scale-105
              hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]
            "
          >
            {link.label}
          </a>
        ))}
      </div>

    
      <div className="h-5 w-px bg-zinc-800 hidden sm:block mx-1" />

     
      <div className="flex items-center">
        <Link href="/login">
          <Button 
            className="
              rounded-full 
              h-10 px-6 text-sm font-semibold     /* Aumentei altura e padding */
              text-white border-0
              bg-gradient-to-r from-[#F472B6] to-[#8B5CF6] /* O gradiente da marca */
              hover:opacity-90 
              shadow-[0_0_15px_rgba(244,114,182,0.4)]      /* Glow rosa suave */
              hover:shadow-[0_0_25px_rgba(244,114,182,0.6)] /* Glow intenso no hover */
              transition-all duration-300
            "
          >
            Entrar
          </Button>
        </Link>
      </div>
    </nav>
  );
};