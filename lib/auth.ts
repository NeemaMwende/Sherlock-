import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import sql from "./db";
import { headers } from "next/headers";
import { loginRateLimit } from "./rate-limit";

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY!;
  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });
  const data = await res.json();
  if (!data.success || (data.score && data.score < 0.5)) {
    throw new Error("Failed reCAPTCHA verification");
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        recaptchaToken: { label: "reCAPTCHA Token", type: "text" },
      },
      async authorize(credentials) {
        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.recaptchaToken
        )
          return null;

        // ✅ verify CAPTCHA
        await verifyRecaptcha(credentials.recaptchaToken);

        // ✅ get client IP
        const headersList = await headers();
        const ip =
          headersList.get("x-forwarded-for")?.split(",")[0] ??
          headersList.get("x-real-ip") ??
          "unknown";

        // ✅ rate limit check
        const { success } = await loginRateLimit.limit(
          `login:${ip}:${credentials.email}`,
        );
        if (!success) return null;

        // ✅ fetch user
        const users =
          await sql`SELECT * FROM users WHERE email = ${credentials.email}`;
        const user = users[0];
        if (!user) return null;

        // ✅ check password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isValid) return null;

        // ✅ update last login
        await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

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
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role) session.user.role = token.role;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
};
