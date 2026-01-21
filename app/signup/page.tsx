"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { signupSchema } from "@/lib/validations";
import { z } from "zod";

type SignupData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data: {
    name?: string;
    email: string;
    password: string;
  }) => {
    // runtime guarantee
    const validated = signupSchema.parse(data as SignupData);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validated),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Signup failed");
    }

    router.push("/login");
  };

  return <AuthForm type="signup" onSubmit={handleSignup} />;
}
