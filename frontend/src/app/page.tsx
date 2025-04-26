"use client"

import { getSummary } from "@/api/action"
import { toastError } from "@/components/Toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useLoginStore } from "@/zustand/useLoginStore"
import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"

const Tile = ({
  title,
  number,
  isLoading,
}: {
  title: string
  number: string
  isLoading: boolean
}) => {
  return (
    <Card className="rounded-2xl m-4 shadow-md w-sm">
      <CardHeader>
        <CardTitle className="text-lg text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-" />
        ) : (
          <p className="text-3xl font-bold text-blue-600">{number}</p>
        )}
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["summary"],
    queryFn: getSummary,
  })

  const t = useTranslations()

  if (isError) {
    toastError(error.message)
  }

  return (
    <div className="flex flex-wrap mx-20">
      <Tile
        title={t("TotalPatients")}
        number={`${data?.totalPatients || 0}`}
        isLoading={isPending}
      />
      <Tile
        title={t("TotalTreatments")}
        number={`${data?.totalTreatments || 0}`}
        isLoading={isPending}
      />
      <Tile
        title={t("TotalPayments")}
        number={`₹ ${data?.totalPayments || 0}`}
        isLoading={isPending}
      />
    </div>
  )
}
