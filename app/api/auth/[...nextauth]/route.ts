import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "@/lib/db";
import { comparePassword } from "@/lib/password";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const res = await client.query(`SELECT * FROM "User" WHERE email=$1`, [
          credentials?.email,
        ]);
        const user = res.rows[0];
        if (!user) throw new Error("User not found");

        const valid = await comparePassword(
          credentials!.password,
          user.password,
        );
        if (!valid) throw new Error("Incorrect password");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "database" }, // session-based auth
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
