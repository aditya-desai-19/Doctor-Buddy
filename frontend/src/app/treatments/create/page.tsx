"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PatientDropDown from "../../../components/PatientDropDown"
import { Treatment } from "../../../../generated"
import { useMutation } from "@tanstack/react-query"
import { createTreatment } from "@/api/action"
import { toastError, toastSuccess } from "@/components/Toast"
import { useRouter } from "next/navigation"
import { useCallback } from "react"
import { FullPageSpinner } from "@/components/LoadingSpinner"

export const formSchema = z.object({
  patientId: z.string().min(1, "Please select a patient."),
  treatmentName: z.string().min(1, "Treatment name is required."),
  description: z.string().optional(),
  cost: z
    .number({ invalid_type_error: "Cost must be a number" })
    .int("Cost must be an integer")
    .positive("Cost must be greater than 0"),
})

export type FormData = z.infer<typeof formSchema>

export default function CreateTreatmentPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const mutation = useMutation({
    mutationFn: createTreatment,
  })

  const t = useTranslations()
  const router = useRouter()

  const onSubmit = useCallback((data: FormData) => {
    const treatment: Treatment = {
      name: data.treatmentName,
      cost: data.cost,
      description: data.description,
      patientId: data.patientId,
    }
    mutation.mutate(treatment, {
      onSuccess: (data) => {
        toastSuccess(t("TreatmentSuccessMsg"))
        router.push(`/treatments/${data.id}`)
      },
      onError: () => {
        toastError(t("SomeErrorOccured"))
      },
    })
    form.reset({
      cost: Number(""),
      description: "",
      patientId: "",
      treatmentName: "",
    })
  }, [])

  const onSelect = useCallback((id: string) => {
    form.setValue("patientId", id)
  }, [])

  return (
    <div className="mx-30 my-10 max-sm:mx-6">
      {mutation.isPending && <FullPageSpinner />}
      <h2 className="my-6 text-xl text-blue-900">{t("CreateTreatment")}</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-md mx-auto mt-10 text-[var(--font-color)]"
        >
          <div>
            <label className="block mb-2 text-sm font-medium">
              {t("SelectPatient")}
            </label>
            <PatientDropDown onSelect={onSelect} />
          </div>

          {/* Treatment name */}
          <div>
            <FormField
              control={form.control}
              name={"treatmentName"}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t("TreatmentName")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"e.g., Root Canal"}
                        {...field}
                        type={"text"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          {/* Description */}
          <div>
            <FormField
              control={form.control}
              name={"description"}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t("Description")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("TreatmentDescMsg")}
                        {...field}
                        type={"text"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          {/* Cost */}
          <div>
            <FormField
              control={form.control}
              name={"cost"}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>{t("TreatmentCost")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={"e.g., 1500"}
                        {...field}
                        type={"number"}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />
          </div>

          {/* Submit */}
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
