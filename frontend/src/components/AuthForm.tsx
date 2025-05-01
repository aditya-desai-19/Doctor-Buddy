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
import { handleLogin, handleSignUp } from "@/api/action"
import { toastError, toastSuccess } from "./Toast"
import { useRouter } from "next/navigation"
import { useLoginStore } from "@/zustand/useLoginStore"

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
  const [currentFocussedInputIdx, setCurrentFocussedInputIdx] =
    useState<number>(0)

  const t = useTranslations()
  const router = useRouter()
  const inputRef = useRef<any>(null) //todo
  const setIsLoggedIn = useLoginStore((state) => state.setIsLoggedIn)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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
          setIsLoggedIn(true)
        } else {
          toastError(t("SomeErrorOccured"))
        }
      }
      setIsLoading(false)
      form.reset(
        isSignUp
          ? {
              firstName: "",
              lastName: "",
              email: "",
              password: "",
            }
          : {
              email: "",
              password: "",
            }
      )
    },
    [isSignUp, form]
  )

  const onKeyDown = useCallback(
    (e: { key: string }) => {
      if (inputRef.current) {
        if (e.key == ARROW_UP) {
          const idx =
            currentFocussedInputIdx === 0 ? 0 : currentFocussedInputIdx - 1
          inputRef.current[idx].focus()
        } else if (e.key == ARROW_DOWN) {
          const idx =
            currentFocussedInputIdx === inputRef.current.length - 3
              ? inputRef.current.length - 3
              : currentFocussedInputIdx + 1
          inputRef.current[idx].focus()
        }
      }
    },
    [inputRef.current, currentFocussedInputIdx]
  )

  const onNavigate = useCallback(() => {
    isSignUp ? router.push("/login") : router.push("/sign-up")
  }, [isSignUp])

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
      <div className="flex items-center justify-center h-[calc(100%-70px)] ">
        <div className="space-y-8 w-lg border-2 p-2 shadow-md rounded-xl max-sm:w-4/5">
          <h2
            className="text-center text-xl font-semibold"
            style={{ color: "var(--font-color)" }}
          >
            {isSignUp ? t("SignUp") : t("Login")}
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 flex flex-col align-center"
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
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white w-36"
                >
                  {isSignUp ? t("Submit") : t("Login")}
                </Button>
              </div>
              <span className="text-center text-sm">
                {`${isSignUp ? t("Already") : t("Not")} ${"Registered"}?`}
                <Button
                  variant={"link"}
                  type="button"
                  className="p-0 mx-2 text-blue-500 text-md cursor-pointer"
                  onClick={onNavigate}
                >
                  {isSignUp ? t("Login") : t("SignUp")}
                </Button>
              </span>
            </form>
          </Form>
        </div>
      </div>
    </>
  )
}
