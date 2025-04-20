"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import React, { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import AlertDialogComponent from "@/components/AlertDialogComponent"
import { useTranslations } from "next-intl"
import { useMutation } from "@tanstack/react-query"
import { deletePatient, searchPatient } from "@/api/action"
import { toastError, toastSuccess } from "@/components/Toast"
import { usePatientStore } from "@/zustand/usePatient"
import { PatientInfo } from "../../../generated"
import { Input } from "@/components/ui/input"
import { FullPageSpinner } from "@/components/LoadingSpinner"
import {debounce} from "lodash"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const [isSearching, setIsSearching] = useState<boolean>()
  const { patients, setPatients, removePatient } = usePatientStore(
    (state) => state
  )
  const t = useTranslations()
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: deletePatient,
  })

  const table = useReactTable({
    data: patients as unknown as TData[],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })
  const selectedRow = table.getSelectedRowModel().rows[0]?.original

  const onEdit = useCallback(() => {
    if (selectedRow) {
      //@ts-ignore
      router.push(`/patients/${selectedRow.id}`)
    }
  }, [selectedRow])

  const onDelete = useCallback(() => {
    if (selectedRow) {
      //@ts-ignore
      removePatient(selectedRow.id)
      //@ts-ignore
      mutation.mutate(selectedRow.id!, {
        onSuccess: () => {
          toastSuccess(t("DeleteSuccessMsg"))
        },
        onError: () => {
          toastError(t("SomeErrorOccured"))
        },
      })
    }
  }, [selectedRow])

  const onSearchTextChange = useCallback(debounce(async (e: any) => {
    setIsSearching(true)
    const filteredData = await searchPatient(e.target.value)
    filteredData
      ? setPatients(filteredData.data as unknown as PatientInfo[])
      : toastError(t("SomeErrorOccured"))
    setIsSearching(false)
  }, 300), [])

  useEffect(() => {
    setPatients(data as unknown as PatientInfo[])
  }, [])

  return (
    <div>
      {isSearching && <FullPageSpinner />}
      <Input
        placeholder="Search..."
        className="w-1/4 my-2"
        onChange={onSearchTextChange}
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("NoResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex">
        <Button
          className="m-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => router.push("/patients/create")}
        >
          {t("Create")}
        </Button>
        <Button
          className="m-2 bg-sky-600 hover:bg-sky-700 text-white"
          disabled={
            selectedRow && Object.keys(selectedRow).length > 0 ? false : true
          }
          onClick={onEdit}
        >
          {t("Edit")}
        </Button>
        <AlertDialogComponent
          dialogButtonText={t("Delete")}
          dialogButtonClassName="m-2 bg-rose-600 hover:bg-rose-700 text-white w-16 p-1 rounded-md text-sm"
          onDelete={onDelete}
          dialogButtonDisabled={
            selectedRow && Object.keys(selectedRow).length > 0 ? false : true
          }
          alertTitle={t("DeleteDialogTitle")}
          dialogActionClassName="bg-rose-600 hover:bg-rose-700 text-white"
          dialogActionButtonText={t("Delete")}
        />
      </div>
    </div>
  )
}
