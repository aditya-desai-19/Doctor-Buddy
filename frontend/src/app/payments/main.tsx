"use client"

import DataTable from "@/components/Datatable"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { PaginatedPaymentResponse, PaymentInfo } from "../../../generated"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { debounce } from "lodash"
import { Input } from "@/components/ui/input"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import { useMutation } from "@tanstack/react-query"
import { deletePayment } from "@/api/action"
import { toastError, toastSuccess } from "@/components/Toast"

type Props = {
  data: PaginatedPaymentResponse | null
}

export const columns: ColumnDef<PaymentInfo>[] = [
  {
    id: "select",
    header: "",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "treatmentName",
    header: "Treatment Name",
  },
  {
    accessorKey: "patientName",
    header: "Patient Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => {
      const value: string = row.getValue("createdAt")
      const date = new Date(value)
      return format(date, "dd MMMM yyyy") 
    },
  },
]

export default function PatientListView({ data }: Props) {
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [payments, setPayments] = useState<PaymentInfo[]>([])

  const t = useTranslations()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: deletePayment,
  })

  const onEdit = useCallback((id: string) => {
    router.push(`/payments/${id}`)
  }, [])

  const onDelete = useCallback((id: string) => {
    mutation.mutate(id, {
      onSuccess: () => {
        toastSuccess(t("DeletePaymentSuccessMsg"))
      },
      onError: () => {
        toastError(t("SomeErrorOccured"))
      },
    })
  }, [])

  const onSearchTextChange = useCallback(
    debounce(async (e: any) => {
      //todo
      // setIsSearching(true)
      // const filteredData = await searchPatient(e.target.value)
      // filteredData
      //   ? setPatients(filteredData.data as unknown as PatientInfo[])
      //   : toastError(t("SomeErrorOccured"))
      // setIsSearching(false)
    }, 300),
    []
  )

  useEffect(() => {
    setPayments(data?.data || [])
  }, [data?.data])

  return (
    <div>
      {isSearching && <FullPageSpinner />}
      <Input
        placeholder="Search..."
        className="w-1/4 my-2"
        onChange={onSearchTextChange}
      />
      <DataTable
        data={payments}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}
