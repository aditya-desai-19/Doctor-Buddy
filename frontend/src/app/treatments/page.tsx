"use client"

import { deletTreatmentById, getTreatments } from "@/api/action"
import DataTable from "@/components/Datatable"
import { toastError, toastSuccess } from "@/components/Toast"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {  TreatmentInfo } from "../../../generated"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { debounce } from "lodash"
import { Input } from "@/components/ui/input"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import { CommonRequestQueryParms } from "@/common/types"

export const columns: ColumnDef<TreatmentInfo>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "firstName",
    header: "Patient's First name",
  },
  {
    accessorKey: "lastName",
    header: "Patient's last name",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
  },
  {
    accessorKey: "cost",
    header: "Total cost",
  },
  {
    accessorKey: "totalPaid",
    header: "Amount paid",
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

export default function TreatmentListView() {
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [treatments, setTreatments] = useState<TreatmentInfo[]>([])
  const t = useTranslations()
  const router = useRouter()

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["get-payment"],
    queryFn: () => getTreatments({}),
  })

  const mutation = useMutation({
    mutationFn: deletTreatmentById,
  })

  if (isError) {
    console.error(error.message)
    toastError(t("SomeErrorOccured"))
  }

  const onCreate = useCallback(() => {
    router.push(`/treatments/create`)
  }, [])

  const onEdit = useCallback((id: string) => {
    router.push(`/treatments/${id}`)
  }, [])

  const onDelete = useCallback(
    (id: string) => {
      const filteredTreatments = treatments.filter((x) => x.id !== id)
      setTreatments(filteredTreatments)
      mutation.mutate(id!, {
        onSuccess: () => {
          toastSuccess(t("DeleteTreatmentSuccessMsg"))
        },
        onError: () => {
          toastError(t("SomeErrorOccured"))
        },
      })
    },
    [treatments]
  )

  const onSearchTextChange = useCallback(
    debounce(async (e: any) => {
      setIsSearching(true)
      const req: CommonRequestQueryParms = {
        search: e.target.value,
      }
      const filteredData = await getTreatments(req)
      filteredData
        ? setTreatments(filteredData.data as unknown as TreatmentInfo[])
        : toastError(t("SomeErrorOccured"))
      setIsSearching(false)
    }, 300),
    []
  )

  useEffect(() => {
    setTreatments(data?.data || [])
  }, [data?.data])

  return (
    <div className="h-9/10 p-10">
      <div>
        {(isSearching || isPending) && <FullPageSpinner />}
        <Input
          placeholder="Search..."
          className="w-1/4 my-2"
          onChange={onSearchTextChange}
        />
        <DataTable
          data={treatments}
          columns={columns}
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
