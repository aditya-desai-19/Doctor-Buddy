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
import { FormData, formSchema } from "../constants"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import PatientDropDown from "../../../components/PatientDropDown"
import { Input } from "@/components/ui/input"
import SubHeading from "@/components/SubHeading"
import { usePathname, useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getTreatmentById, updateTreatment } from "@/api/action"
import { toastError, toastSuccess } from "@/components/Toast"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import { useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UpdateTreatmentWithIdRequest } from "@/common/types"
import { usePaymentStore } from "@/zustand/usePaymentStore"
import PaymentListView from "@/components/PaymentListView"

export default function EditTreatmentPage() {
  const t = useTranslations()
  const pathname = usePathname()
  const id = pathname.substring(pathname.indexOf("s/") + 2)
  const router = useRouter()
  const setTreatmentId = usePaymentStore(state => state.setTreatmentId)
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const description = form.watch("description")

  const mutation = useMutation({
    mutationFn: updateTreatment,
  })
  
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getTreatment"],
    queryFn: () => getTreatmentById(id),
  })

  if (isError) {
    toastError(error.message)
  }
  
  const onSave = useCallback(() => {
    const data = form.getValues()
    const requestBody: UpdateTreatmentWithIdRequest = {
      id,
      name: data.treatmentName,
      description: data.description,
      cost: data.cost
    }
    mutation.mutate(requestBody, {
      onSuccess: (data) => {
        toastSuccess(t("SuccessfullyUpdatedPatientDetails"))
        form.reset({
          cost: data.cost,
          description: data.description,
          patientId: data.patientId,
          treatmentName: data.name
        })
      },
      onError: (error) => {
        console.error(error)
        toastError(t("SomeErrorOccured"))
      },
    })
  }, [form, pathname])

  const navigateToList = useCallback(() => {
    router.push("/treatments")
  }, [])

  const onSelect = useCallback((id: string) => {
    form.setValue("patientId", id)
  }, [])

  const onCreate = useCallback(() => {
    setTreatmentId(id)
    router.push("/payments/create")
  }, [id])

  const checkDisabilityOfButton = useCallback(() => {
    if(!data?.description) {
      return description === "" || description === undefined
    }
    return !form.formState.isDirty
  }, [data, description, form])

  useEffect(() => {
    if (data) {
      const { patientId, name, cost, description } = data
      form.reset({
        treatmentName: name,
        description: description || undefined,
        cost: cost,
        patientId: patientId
      })
    }
  }, [data])

  return (
    <div className="mx-30 my-10 max-sm:mx-6">
      {(mutation.isPending || isPending) && <FullPageSpinner />}
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
                className="space-y-6 text-[var(--font-color)]"
              >
                <div className="flex mx-2">
                  <div className="w-full m-2">
                    <label className="block  text-sm font-medium">
                      {t("SelectPatient")}
                    </label>
                    <PatientDropDown onSelect={onSelect} patientId={data?.patientId}/>
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
      <Accordion
        type="single"
        collapsible
        className="my-6 text-lg text-blue-900 border-b"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>{t("PaymentDetails")}</AccordionTrigger>
          <AccordionContent>
            <PaymentListView treatmentId={id} showSearch={false} onCreate={onCreate} className="my-4"/>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div>
        <Button
          className="my-6 mx-2 bg-blue-500 hover:bg-blue-600"
          onClick={onSave}
          disabled={checkDisabilityOfButton()}
        >
          {t("Save")}
        </Button>
        <Button
          className="my-6 mx-2 bg-blue-500 hover:bg-blue-600"
          onClick={navigateToList}
        >
          {t("BackToList")}
        </Button>
      </div>
    </div>
  )
}
