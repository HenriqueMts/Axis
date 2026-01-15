"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "A senha é obrigatória"),
});

export async function loginWithCredentialsAction(data: z.infer<typeof loginSchema>) {
    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
        return { error: validation.error.issues[0].message };
    }

    const { email, password } = validation.data;

    try {

        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        return { success: true };

    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return { error: "Email ou senha incorretos." };
            }
            return { error: "Ocorreu um erro ao entrar." };
        }
        throw error;
    }
}