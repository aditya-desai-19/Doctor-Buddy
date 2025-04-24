"use client"

import { deletePatient, searchPatient } from "@/api/action"
import DataTable from "@/components/Datatable"
import { toastError, toastSuccess } from "@/components/Toast"
import { usePatientStore } from "@/zustand/usePatientStore"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { PaginatedPatientResponse, PatientInfo } from "../../../generated"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { debounce } from "lodash"
import { Input } from "@/components/ui/input"
import { FullPageSpinner } from "@/components/LoadingSpinner"

type Props = {
  data: PaginatedPatientResponse | null
}

export const columns: ColumnDef<PatientInfo>[] = [
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

  const t = useTranslations()
  const router = useRouter()

  //todo
  // const mutation = useMutation({
  //   mutationFn: deletePatient,
  // })

  const onEdit = useCallback((id: string) => {
    router.push(`/payments/${id}`)
  }, [])

  const onDelete = useCallback((id: string) => {
    // removePatient(id)
    // //@ts-ignore
    // mutation.mutate(selectedRow.id!, {
    //   onSuccess: () => {
    //     toastSuccess(t("DeleteSuccessMsg"))
    //   },
    //   onError: () => {
    //     toastError(t("SomeErrorOccured"))
    //   },
    // })
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

  // useEffect(() => {
  //   setPatients(data?.data || [])
  // }, [data?.data])

  return (
    <div>
      {isSearching && <FullPageSpinner />}
      <Input
        placeholder="Search..."
        className="w-1/4 my-2"
        onChange={onSearchTextChange}
      />
      <DataTable
        data={data}
        columns={columns}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}
