"use client"

import { z } from "zod"
import AuthForm from "@/components/AuthForm"
import withRedirectIfLoggedIn from "@/components/withCheckIsLoggedIn"

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const SignUp = () => {
  return <AuthForm formSchema={formSchema} isSignUp={true} />
}

export default withRedirectIfLoggedIn(SignUp) 
