"use client"

import AuthForm from "@/components/AuthForm"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function Login() {
  return <AuthForm formSchema={formSchema} isSignUp={false} />
}
