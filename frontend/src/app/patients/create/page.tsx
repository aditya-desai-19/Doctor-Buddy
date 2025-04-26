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
import SubHeading from "@/components/SubHeading"

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
    mutationFn: createPatient
  })

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    const data: CreatePatientRequest = { ...values }
    mutation.mutate(data, {
      onSuccess: (res) => {
        toastSuccess(t("SuccessfullyCreatedPatient"))
        res && router.push(`/patients/${res.id}`)
      },
      onError: () => {
        toastError(t("SomeErrorOccured"))
      },
    })
  }, [])

  return (
    <div className="mx-30 my-10">
      <SubHeading title={t("CreatePatient")}/>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-md mx-auto mt-10 text-[var(--font-color)]"
        >
          <FormField
            control={form.control}
            name={"firstName"}
            render={({ field }) => {
              return (
                <FormItem>
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
              <FormItem>
                <FormLabel>{t("LastName")}</FormLabel>
                <FormControl>
                  <Input placeholder={"Doe"} {...field} type={"text"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
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
              <FormItem>
                <FormLabel>{t("ContactNumber")}</FormLabel>
                <FormControl>
                  <Input placeholder={"eg: 8000010000"} {...field} type={"text"} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {t("Submit")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
