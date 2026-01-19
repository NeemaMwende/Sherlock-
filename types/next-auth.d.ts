import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: "admin" | "user";
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role?: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
  }
}
