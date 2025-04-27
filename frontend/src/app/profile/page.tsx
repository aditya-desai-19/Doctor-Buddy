"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDoctorStore } from "@/zustand/useDoctorStore"
import { useTranslations } from "next-intl"
import { useCallback, useEffect, useState } from "react"
import { DoctorInfoResponse, UpdateDoctorInfoRequest } from "../../../generated"
import { useMutation } from "@tanstack/react-query"
import { saveDoctorInfo } from "@/api/action"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import { toastSuccess } from "@/components/Toast"

export default function Profile() {
  const { initials, doctorDetails, setDoctorDetails } = useDoctorStore((state) => state)
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfoResponse>()

  const t = useTranslations()
  const mutation = useMutation({
    mutationFn: saveDoctorInfo,
  })

  const onSave = useCallback(() => {
    if(doctorInfo) {
      setDoctorDetails(doctorInfo)
      mutation.mutate(doctorInfo as UpdateDoctorInfoRequest, {
        onSuccess: (data) => {
          toastSuccess(t("EditDoctorSuccessMsg"))
          setDoctorInfo(data)
          setDoctorDetails(data)
        },
        onError: () => {

        }
      })
    }
  }, [doctorInfo])

  useEffect(() => {
    setDoctorInfo(doctorDetails)
  }, [doctorDetails])


  //todo improve styling
  return (
    <div className="mx-25 my-10 flex">
      {mutation.isPending && <FullPageSpinner />}
      <div className="p-4 border-gray-300 border-2 rounded-md w-1/4 h-1/8 flex mx-2">
        <Avatar className="h-14 w-14">
          <AvatarFallback className="text-black">{initials}</AvatarFallback>
        </Avatar>
        <div className="mx-2">
          <p>{t("Hello")}</p>
          <p>{`${doctorDetails.firstName} ${doctorDetails.lastName}`}</p>
        </div>
      </div>
      <div className="border-gray-300 border-2 rounded-md w-3/4 p-4">
        <div className="my-4">
          <h2>{t("PersonalInformation")}</h2>
          <div className="flex my-2">
            <Input
              value={doctorInfo?.firstName}
              className="mx-2"
              onChange={(e) => {
                setDoctorInfo({ ...doctorInfo, firstName: e.target.value })
              }}
            />
            <Input
              value={doctorInfo?.lastName}
              className="mx-2"
              onChange={(e) => {
                setDoctorInfo({ ...doctorInfo, lastName: e.target.value })
              }}
            />
          </div>
        </div>
        <div className="my-4">
          <h2>{t("EmailAddress")}</h2>
          <Input
            value={doctorInfo?.email}
            className="mx-2"
            onChange={(e) => {
              setDoctorInfo({ ...doctorInfo, email: e.target.value })
            }}
          />
        </div>
        <Button
          className="m-2 bg-sky-600 hover:bg-sky-700 text-white"
          disabled={
            doctorInfo?.firstName === doctorDetails.firstName &&
            doctorInfo?.lastName === doctorDetails.lastName &&
            doctorInfo?.email === doctorDetails.email
          }
          onClick={onSave}
        >
          {t("Save")}
        </Button>
      </div>
    </div>
  )
}
