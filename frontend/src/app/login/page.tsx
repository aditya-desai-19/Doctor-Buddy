"use client"

import AuthForm from "@/components/AuthForm"
import withRedirectIfLoggedIn from "@/components/withCheckIsLoggedIn"
import { z } from "zod"

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const Login = () => {

  return <AuthForm formSchema={formSchema} isSignUp={false} />
}

export default withRedirectIfLoggedIn(Login)
