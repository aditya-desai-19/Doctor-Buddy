"use client"

import DataTable from "@/components/Datatable"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { PaymentInfo } from "../../../generated"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { debounce } from "lodash"
import { Input } from "@/components/ui/input"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { deletePayment, getPayments } from "@/api/action"
import { toastError, toastSuccess } from "@/components/Toast"

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

type Props = {
  treatmentId?: string
  showSearch?: boolean
  onCreate?: () => void
}

export default function PaymentListView({treatmentId, showSearch=true, onCreate=undefined}: Props) {
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [payments, setPayments] = useState<PaymentInfo[]>([])

  const t = useTranslations()
  const router = useRouter()

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["get-payment"],
    queryFn: () => getPayments({treatmentId: treatmentId || undefined}),
  })

  const mutation = useMutation({
    mutationFn: deletePayment,
  })

  if (isError) {
    console.error(error.message)
    toastError(t("SomeErrorOccured"))
  }

  const onEdit = useCallback((id: string) => {
    router.push(`/payments/${id}`)
  }, [])

  const onDelete = useCallback(
    (id: string) => {
      const filteredPayments = payments.filter((x) => x.id !== id)
      setPayments(filteredPayments)
      mutation.mutate(id, {
        onSuccess: () => {
          toastSuccess(t("DeletePaymentSuccessMsg"))
        },
        onError: () => {
          toastError(t("SomeErrorOccured"))
        },
      })
    },
    [payments]
  )

  const onSearchTextChange = useCallback(
    debounce(async (e: any) => {
      setIsSearching(true)
      const filteredData = await getPayments({search: e.target.value})
      filteredData
        ? setPayments(filteredData.data as unknown as PaymentInfo[])
        : toastError(t("SomeErrorOccured"))
      setIsSearching(false)
    }, 300),
    []
  )

  useEffect(() => {
    setPayments(data?.data || [])
  }, [data?.data])

  return (
    <div className="h-9/10 p-10">
      <div>
        {(isSearching || isPending) && <FullPageSpinner />}
        {showSearch && <Input
          placeholder="Search..."
          className="w-1/4 my-2"
          onChange={onSearchTextChange}
        />}
        <DataTable
          data={payments}
          columns={columns}
          onEdit={onEdit}
          onDelete={onDelete}
          onCreate={onCreate}
        />
      </div>
    </div>
  )
}
