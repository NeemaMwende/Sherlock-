"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { signupSchema } from "@/lib/validations";

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = async (data: any) => {
    const validated = signupSchema.parse(data);

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
