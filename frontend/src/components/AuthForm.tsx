"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl"
import { useCallback, useState } from "react"
import { FullPageSpinner } from "./LoadingSpinner"
import { CreateDoctorRequest, LoginDoctorRequest } from "../../generated"
import { handleLogin, handleSignUp } from "@/api/server"
import { toast } from "sonner"
import { toastError, toastSuccess } from "./Toast"

type Props = {
  formSchema: any //todo
  isSignUp: boolean
}

export default function SignUp({ formSchema, isSignUp }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const t = useTranslations()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      setIsLoading(true)
      if (isSignUp) {
        const data: CreateDoctorRequest = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }
        const response = await handleSignUp(data)
        response
          ? toastSuccess(t("SignUpSuccessMsg"))
          : toastError(t("SomeErrorOccured"))
      } else {
        const data: LoginDoctorRequest = {
          email: values.email,
          password: values.password,
        }
        const response = await handleLogin(data)
        response
          ? toastSuccess(t("LoginSuccessMsg"))
          : toastError(t("SomeErrorOccured"))
      }
      setIsLoading(false)
    },
    [isSignUp]
  )

  return (
    <>
      {isLoading && <FullPageSpinner />}
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-8 w-lg border-2 p-2 rounded-sm">
          <h2 className="text-center text-xl">
            {isSignUp ? t("SignUp") : t("Login")}
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {isSignUp && (
                <>
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("FirstName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
                            {...field}
                            className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("LastName")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Doe"
                            {...field}
                            className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Password")}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSignUp ? t("Submit") : t("Login")}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
