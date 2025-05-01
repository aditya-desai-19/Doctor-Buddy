"use client"

import { getPatient, updatePatient } from "@/api/action"
import { UpdatePatientWithIdRequest } from "@/common/types"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import SubHeading from "@/components/SubHeading"
import { toastError, toastSuccess } from "@/components/Toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email").optional(),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
})

export default function PatientEdit() {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const id = pathname.substring(pathname.indexOf("s/") + 2)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const email = form.watch("email")

  const mutation = useMutation({
    mutationFn: updatePatient,
  })

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["getPatient"],
    queryFn: () => getPatient(id),
  })

  if (isError) {
    toastError(error.message)
  }

  const onSave = useCallback(() => {
    try {
      const data = form.getValues()
      formSchema.parse(data)
      const requestBody: UpdatePatientWithIdRequest = {
        ...data,
        id,
      }
      mutation.mutate(requestBody, {
        onSuccess: (data) => {
          toastSuccess(t("SuccessfullyUpdatedPatientDetails"))
          console.log({ data })
          form.reset({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email || "",
            contactNumber: data.contactNumber,
          })
        },
        onError: (error) => {
          console.error(error)
          toastError(t("SomeErrorOccured"))
        },
      })
    } catch (error) {
      toastError(t("SomeErrorOccured"))
    }
  }, [form, pathname])

  const navigateToList = useCallback(() => {
    router.push("/patients")
  }, [])

  const checkDisabilityOfButton = useCallback(() => {
    if(!data?.email) {
      return email === ""
    }
    return !form.formState.isDirty
  }, [data, email, form])

  useEffect(() => {
    if (data) {
      const { firstName, lastName, email, contactNumber } = data
      const values: any = {
        firstName,
        lastName,
        email,
        contactNumber,
      }
      form.reset(values)
    }
  }, [data])

  return (
    <div className="mx-30 my-10 max-sm:mx-6">
      {(mutation.isPending || isPending) && <FullPageSpinner />}
      <SubHeading title={t("EditPatient")} />
      <Accordion
        type="single"
        collapsible
        className="my-6 text-lg text-blue-900 border-b"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>{t("PersonalInformation")}</AccordionTrigger>
          <AccordionContent>
            <Form {...form}>
              <form className="space-y-6 text-[var(--font-color)]">
                <div className="flex mx-2">
                  <FormField
                    control={form.control}
                    name={"firstName"}
                    render={({ field }) => {
                      return (
                        <FormItem className="w-full m-2">
                          <FormLabel>{t("FirstName")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={"John"}
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
                    name={"lastName"}
                    render={({ field }) => (
                      <FormItem className="w-full m-2">
                        <FormLabel>{t("LastName")}</FormLabel>
                        <FormControl>
                          <Input placeholder={"Doe"} {...field} type={"text"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex mx-2">
                  <FormField
                    control={form.control}
                    name={"email"}
                    render={({ field }) => (
                      <FormItem className="w-full m-2">
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
                      <FormItem className="w-full m-2">
                        <FormLabel>{t("ContactNumber")}</FormLabel>
                        <FormControl>
                          <Input {...field} type={"text"} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
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
