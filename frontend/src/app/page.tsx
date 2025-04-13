"use client"

import { useLoginStore } from "@/zustand/useLoginStore"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSummaryStore } from "@/zustand/useSummaryStore"
import { useTranslations } from "next-intl"

const Tile = ({ title, number }: { title: string; number: number }) => {
  return (
    <Card className="rounded-2xl m-4 shadow-md w-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-blue-600">{number}</p>
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const isLoggedIn = useLoginStore(state => state.isLoggedIn)
  const { totalPatients, totalPayments, totalTreatments } = useSummaryStore(
    (state) => state
  )

  const t = useTranslations()
  const router = useRouter()

  useEffect(() => {
    if(!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn])

  return (
    <>
      <div className="flex flex-wrap">
        <Tile title={t("TotalPatients")} number={totalPatients} />
        <Tile title={t("TotalTreatments")} number={totalTreatments} />
        <Tile title={t("TotalPayments")} number={totalPayments} />
      </div>
    </>
  )
}
