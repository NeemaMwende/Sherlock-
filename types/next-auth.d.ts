import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      role: "admin" | "user";
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "admin" | "user";
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: "admin" | "user";
  }
}

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
