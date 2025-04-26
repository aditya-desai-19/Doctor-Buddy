"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { FormData, formSchema } from "../create/page"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PatientDropDown from "../PatientDropDown"
import { Input } from "@/components/ui/input"
import SubHeading from "@/components/SubHeading"

export default function EditTreatmentPage() {
  const t = useTranslations()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)

    // Call your API here
  }

  const onSelect = (id: string) => {
    form.setValue("patientId", id)
  }

  return (
    <div className="mx-30 my-10">
      <SubHeading title={t("EditTreatment")}/>
      <Accordion
        type="single"
        collapsible
        className="my-6 text-lg text-blue-900 border-b"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>{t("TreatmentDetails")}</AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 text-[var(--font-color)]"
              >
                <div className="flex mx-2">
                  <div className="w-full m-2">
                    <label className="block  text-sm font-medium">
                      {t("SelectPatient")}
                    </label>
                    <PatientDropDown onSelect={onSelect} />
                  </div>
                    <FormField
                      control={form.control}
                      name={"treatmentName"}
                      render={({ field }) => {
                        return (
                          <FormItem className="w-full m-2">
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
                <div className="flex mx-2">
                    <FormField
                      control={form.control}
                      name={"description"}
                      render={({ field }) => {
                        return (
                          <FormItem className="w-full m-2">
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
                    <FormField
                      control={form.control}
                      name={"cost"}
                      render={({ field }) => {
                        return (
                          <FormItem className="w-full m-2">
                            <FormLabel>{t("TreatmentCost")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={"e.g., 1500"}
                                {...field}
                                type={"number"}
                                onChange={(e) =>
                                  field.onChange(e.target.valueAsNumber)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )
                      }}
                    />
                </div>
              </form>
            </Form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
