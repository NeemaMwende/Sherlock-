import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import sql from "./db";
import { headers } from "next/headers";
import { loginRateLimit } from "./rate-limit";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        /* -------------------------------
           1️⃣ Get client IP
        -------------------------------- */
        const headersList = await headers();
        const ip =
          headersList.get("x-forwarded-for")?.split(",")[0] ??
          headersList.get("x-real-ip") ??
          "unknown";

        /* -------------------------------
           2️⃣ Apply rate limit
        -------------------------------- */
        const { success } = await loginRateLimit.limit(
          `login:${ip}:${credentials.email}`,
        );

        if (!success) {
          // ❗ Silent fail = security best practice
          return null;
        }
        const users = await sql`
          SELECT * FROM users WHERE email = ${credentials.email}
        `;

        const user = users[0];
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        await sql`
          UPDATE users SET last_login = NOW() WHERE id = ${user.id}
        `;

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
