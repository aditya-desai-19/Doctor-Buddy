"use client"

import { z } from "zod"
import AuthForm from "@/components/AuthForm"

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function SignUp() {
  return <AuthForm formSchema={formSchema} isSignUp={true} />
}
