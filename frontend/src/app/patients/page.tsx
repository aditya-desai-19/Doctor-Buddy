"use client"

import { deletePatient, getPatients, searchPatient } from "@/api/action"
import DataTable from "@/components/Datatable"
import { toastError, toastSuccess } from "@/components/Toast"
import { usePatientStore } from "@/zustand/usePatientStore"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { PatientInfo } from "../../../generated"
import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { debounce } from "lodash"
import { Input } from "@/components/ui/input"
import { FullPageSpinner } from "@/components/LoadingSpinner"

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
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
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
  {
    accessorKey: "total_treatments",
    header: "Total treatments",
  },
]

export default function PatientListView() {
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const { patients, setPatients, removePatient } = usePatientStore(
    (state) => state
  )

  const t = useTranslations()
  const router = useRouter()

  const { isPending, data, isError, error } = useQuery({
    queryKey: ["get-payment"],
    queryFn: getPatients,
  })

  const mutation = useMutation({
    mutationFn: deletePatient,
  })

  if (isError) {
    console.error(error.message)
    toastError(t("SomeErrorOccured"))
  }

  const onCreate = useCallback(() => {
    router.push(`/patients/create`)
  }, [])

  const onEdit = useCallback((id: string) => {
    router.push(`/patients/${id}`)
  }, [])

  const onDelete = useCallback((id: string) => {
    removePatient(id)
    mutation.mutate(id, {
      onSuccess: () => {
        toastSuccess(t("DeletePatientSuccessMsg"))
      },
      onError: () => {
        toastError(t("SomeErrorOccured"))
      },
    })
  }, [])

  const onSearchTextChange = useCallback(
    debounce(async (e: any) => {
      setIsSearching(true)
      const filteredData = await searchPatient(e.target.value)
      filteredData
        ? setPatients(filteredData.data as unknown as PatientInfo[])
        : toastError(t("SomeErrorOccured"))
      setIsSearching(false)
    }, 300),
    []
  )

  useEffect(() => {
    setPatients(data?.data || [])
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
          data={patients}
          columns={columns}
          onCreate={onCreate}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
