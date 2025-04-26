"use client"

import SubHeading from "@/components/SubHeading"
import { useTranslations } from "next-intl"
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
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePaymentStore } from "@/zustand/usePaymentStore"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createPayment, getTreatmentById } from "@/api/action"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import { toastError, toastSuccess } from "@/components/Toast"
import { useCallback } from "react"
import { Payment } from "../../../../generated"

const formSchema = z.object({
  amount: z.number(),
})

export default function PaymentCreatePage() {
  const treatmentId = usePaymentStore((state) => state.treatmentId)

  const t = useTranslations()
  const router = useRouter()

  if (!treatmentId) {
    router.push("/")
  }

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getTreatment"],
    queryFn: () => getTreatmentById(treatmentId),
  })

  if (isError) {
    console.error(error.message)
    toastError(t("SomeErrorOccured"))
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: createPayment,
    
  })
  
  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    const body: Payment = {
      treatmentId,
      amount: values.amount
    }
    mutation.mutate(body, {
      onSuccess: () => {
        toastSuccess(t("PaymentSuccessMsg"))
        router.push(`/treatments/${treatmentId}`)
      },
      onError: () => {
        toastError(t("SomeErrorOccured"))
      },
    })
  }, [treatmentId])

  return (
    <div className="mx-30 my-10">
      {isPending && <FullPageSpinner />}
      <SubHeading title={t("CreatePayment")} />
      <div className="space-y-6 max-w-md mx-auto mt-10 mb-4 text-[var(--font-color)]">
        <div>
          <label className="my-2">{t("PatientName")}</label>
          <Input value={data?.patientName} disabled />
        </div>
        <div>
          <label className="my-2">{t("TreatmentName")}</label>
          <Input value={data?.name} disabled />
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-md mx-auto text-[var(--font-color)]"
        >
          <FormField
            control={form.control}
            name={"amount"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Amount")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={"eg: 1000"}
                    {...field}
                    type={"number"}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t("Submit")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
