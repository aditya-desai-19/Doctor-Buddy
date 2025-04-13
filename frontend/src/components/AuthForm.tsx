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
import { useCallback, useEffect, useRef, useState } from "react"
import { FullPageSpinner } from "./LoadingSpinner"
import { CreateDoctorRequest, LoginDoctorRequest } from "../../generated"
import { handleLogin, handleSignUp } from "@/api/server"
import { toastError, toastSuccess } from "./Toast"
import { useRouter } from "next/navigation"

type Props = {
  formSchema: any //todo
  isSignUp: boolean
}

type InputType = {
  name: string
  label: string
  type: string
  placeholder: string
}

const ARROW_UP = "ArrowUp"
const ARROW_DOWN = "ArrowDown"

export default function AuthForm({ formSchema, isSignUp }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [inputs, setInputs] = useState<InputType[]>([])
  const [currentFocussedInputIdx, setCurrentFocussedInputIdx] = useState<number>(0)

  const t = useTranslations()
  const router = useRouter()
  const inputRef = useRef<any>(null) //todo 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      form.reset()
      setIsLoading(true)
      if (isSignUp) {
        const data: CreateDoctorRequest = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }
        const response = await handleSignUp(data)
        if (response) {
          router.push("/login")
          toastSuccess(t("SignUpSuccessMsg"))
        } else {
          toastError(t("SomeErrorOccured"))
        }
      } else {
        const data: LoginDoctorRequest = {
          email: values.email,
          password: values.password,
        }
        const response = await handleLogin(data)
        if (response) {
          router.push("/")
          toastSuccess(t("LoginSuccessMsg"))
        } else {
          toastError(t("SomeErrorOccured"))
        }
      }
      setIsLoading(false)
    },
    [isSignUp, form]
  )

  const onKeyDown = useCallback((e: { key: string }) => {
    if (inputRef.current) {
      if(e.key == ARROW_UP) {
        const idx = currentFocussedInputIdx === 0 ? 0 : currentFocussedInputIdx - 1;
        inputRef.current[idx].focus()
      }
      else if(e.key == ARROW_DOWN) {
        const idx = currentFocussedInputIdx === inputRef.current.length - 2 ? inputRef.current.length - 2 : currentFocussedInputIdx + 1;
        console.log({idx})
        inputRef.current[idx].focus()
      }
    }
  }, [inputRef.current, currentFocussedInputIdx])

  useEffect(() => {
    const emailInput: InputType = {
      name: "email",
      label: t("Email"),
      type: "text",
      placeholder: "Email",
    }

    const passwordInput: InputType = {
      name: "password",
      label: t("Password"),
      type: "password",
      placeholder: "Password",
    }

    const newInput = [emailInput, passwordInput]

    if (isSignUp) {
      const firstNameInput: InputType = {
        name: "firstName",
        label: t("FirstName"),
        type: "text",
        placeholder: "John",
      }

      const lastNameInput: InputType = {
        name: "lastName",
        label: t("LastName"),
        type: "text",
        placeholder: "Doe",
      }

      newInput.unshift(lastNameInput)
      newInput.unshift(firstNameInput)
    }

    setInputs(newInput)
  }, [isSignUp])

  return (
    <>
      {isLoading && <FullPageSpinner />}
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-8 w-lg border-2 p-2 rounded-sm">
          <h2 className="text-center text-xl">
            {isSignUp ? t("SignUp") : t("Login")}
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
              ref={inputRef}
              onKeyDown={onKeyDown}
            >
              {inputs.map((inp, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={inp.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{inp.label}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={inp.placeholder}
                          {...field}
                          type={inp.type}
                          className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
                          onFocus={() => setCurrentFocussedInputIdx(index)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
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
