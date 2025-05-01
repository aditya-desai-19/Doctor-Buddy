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
import { usePathname } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getPayment, updatePayment } from "@/api/action"
import { toastError, toastSuccess } from "@/components/Toast"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formSchema } from "../create/page"
import { z } from "zod"
import { UpdatePaymentWithIdRequest } from "@/common/types"

export default function PaymentEditPage() {
  const t = useTranslations()
  const pathname = usePathname()
  const id = pathname.substring(pathname.indexOf("s/") + 2)

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["get-payment-by-id"],
    queryFn: () => getPayment(id),
  })

  if(isError) {
    console.error(error.message)
    toastError(t("SomeErrorOccured"))
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: updatePayment,
  })

  const onSubmit = useCallback((data: z.infer<typeof formSchema>) => {
    const body: UpdatePaymentWithIdRequest = {
      id,
      amount: data.amount
    }
    mutation.mutate(body, {
      onSuccess: (data) => {
        toastSuccess(t("EditPaymentSuccessMsg"))
        form.reset({ amount: data.amount });
      },
      onError: () => {
        toastError(t("SomeErrorOccured"))
      }
    })
  }, [id])

  useEffect(() => {
    if(data && data?.amount) {
      form.reset({ amount: data.amount });
    }
  }, [data])
  
  return (
    <div className="mx-30 my-10 max-sm:mx-6">
      {isPending && <FullPageSpinner />}
      <SubHeading title={t("EditPayment")} />
      <div className="space-y-6 max-w-md mx-auto mt-10 mb-4 text-[var(--font-color)]">
        <div>
          <label className="my-2">{t("PatientName")}</label>
          <Input value={data?.patientName} disabled />
        </div>
        <div>
          <label className="my-2">{t("TreatmentName")}</label>
          <Input value={data?.treatmentName} disabled />
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
            disabled={!form.formState.isDirty || mutation.isPending}
          >
            {t("Submit")}
          </Button>
        </form>
      </Form>
    </div>
  )
}