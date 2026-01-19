"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { loginSchema } from "@/lib/validations";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: any) => {
    const validated = loginSchema.parse(data);

    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (result?.error) {
      throw new Error("Invalid credentials");
    }

    router.push("/dashboard");
    router.refresh();
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
}
