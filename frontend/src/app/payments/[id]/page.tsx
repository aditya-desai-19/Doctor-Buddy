"use client"

import SubHeading from "@/components/SubHeading"
import { useTranslations } from "next-intl"

export default function PaymentEditPage() {
  const t = useTranslations()
  
  return (
    <div className="mx-30 my-10">
      <SubHeading title={t("Edit Payment")} />
    </div>
  )
}