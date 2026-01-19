import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { client } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

const handler = NextAuth({
  session: {
    strategy: "database", // 👈 SESSION-BASED (not JWT)
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await client.query(
          `SELECT * FROM "User" WHERE email = $1`,
          [credentials.email],
        );

        const user = res.rows[0];
        if (!user) return null;

        const valid = await verifyPassword(credentials.password, user.password);

        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
