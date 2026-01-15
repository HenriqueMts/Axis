import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials"; // <--- Novo import
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users } from "./db/schema"; // <--- Importar tabela users
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs"; // <--- Para comparar senhas

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    session: {
        strategy: "jwt", // Credentials exige estratégia JWT, não database session pura
    },
    providers: [
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        // --- Lógica de Login com Senha ---
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const email = credentials.email as string;
                const password = credentials.password as string;

                if (!email || !password) {
                    return null;
                }

                // 1. Busca o usuário no banco
                const [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, email));

                if (!user || !user.password) {
                    return null; // Usuário não existe ou não tem senha (login social)
                }

                // 2. Compara a senha digitada com o hash no banco
                const isPasswordValid = await compare(password, user.password);

                if (!isPasswordValid) {
                    return null; // Senha errada
                }

                // 3. Retorna o objeto do usuário se tudo der certo
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (token.id && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});