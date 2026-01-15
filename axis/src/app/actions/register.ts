"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { z } from "zod";

// Schema de validação no servidor
const registerSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});

export async function registerAction(formData: z.infer<typeof registerSchema>) {
    // 1. Validação dos dados
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const { name, email, password } = result.data;

    try {
        // 2. Verifica se o email já existe
        const [existingUser] = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingUser) {
            return { error: "Este email já está em uso." };
        }

        // 3. Criptografa a senha (Hash)
        // O número 10 é o "custo" do processamento (Salt rounds)
        const hashedPassword = await hash(password, 10);

        // 4. Cria o usuário no banco
        await db.insert(users).values({
            name,
            email,
            password: hashedPassword,
        });

        return { success: true };

    } catch (err) {
        console.error("Erro ao registrar:", err);
        return { error: "Erro interno ao criar conta. Tente novamente." };
    }
}