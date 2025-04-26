"use client"

import { useEffect, useRef, useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useTranslations } from "next-intl"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PatientDropDown from "../PatientDropDown"


export const formSchema = z.object({
  patientId: z.string().min(1, "Please select a patient."),
  treatmentName: z.string().min(1, "Treatment name is required."),
  description: z.string().min(1, "Description is required."),
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

  const selectedPatientId = form.watch("patientId")

  const t = useTranslations()

  const onSubmit = (data: FormData) => {
    console.log(data)
    form.reset({
      cost: Number(""),
      description: "",
      patientId: "",
      treatmentName: "",
    })
    // Call your API here
  }

  const onSelect = (id: string) => {
    form.setValue("patientId", id)
  }

  
  return (
    <div className="mx-30 my-10">
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
            <PatientDropDown onSelect={onSelect}/>
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
