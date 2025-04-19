"use client"

import { createPatient } from "@/api/action"
import { toastError, toastSuccess } from "@/components/Toast"
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
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CreatePatientRequest } from "../../../../generated"

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email").optional(),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
})

export default function PatientCreate() {
  const t = useTranslations()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (data) => {
      console.log({ data })
    },
    onError: () => {
      toastError(t("SomeErrorOccured"))
    },
  })

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    const data: CreatePatientRequest = { ...values }
    mutation.mutate(data, {
      onSuccess: (res) => {
        console.log({res})
        toastSuccess(t("SuccessfullyCreatedPatient"))
        res && router.push(`/patients/${res.id}`)
      },
      onError: () => {
        toastError(t("SomeErrorOccured"))
      },
    })
  }, [])

  return (
    <div className="h-full">
      <h2 className="mx-30 my-10 text-xl text-blue-900">{t("CreatePatient")}</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
          <div className="h-full flex flex-col items-center">
            <div className="flex">
              <FormField
                control={form.control}
                name={"firstName"}
                render={({ field }) => {
                  return (
                    <FormItem className="m-10">
                      <FormLabel>{t("FirstName")}</FormLabel>
                      <FormControl>
                        <Input placeholder={"John"} {...field} type={"text"} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
              <FormField
                control={form.control}
                name={"lastName"}
                render={({ field }) => (
                  <FormItem className="m-10">
                    <FormLabel>{t("LastName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={"Doe"} {...field} type={"text"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex">
              <FormField
                control={form.control}
                name={"email"}
                render={({ field }) => (
                  <FormItem className="m-10">
                    <FormLabel>{t("Email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"john@gmail.com"}
                        {...field}
                        type={"text"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={"contactNumber"}
                render={({ field }) => (
                  <FormItem className="m-10">
                    <FormLabel>{t("ContactNumber")}</FormLabel>
                    <FormControl>
                      <Input {...field} type={"text"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              {t("Submit")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
