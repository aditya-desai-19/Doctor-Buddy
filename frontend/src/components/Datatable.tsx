"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import AlertDialogComponent from "@/components/AlertDialogComponent"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useTranslations } from "next-intl"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onCreate?: () => void | undefined
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  onCreate,
  onEdit,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})

  console.log({data})
  const t = useTranslations()

  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })
  const selectedRow = table.getSelectedRowModel().rows[0]?.original

  return (
    <div>
      <div className="rounded-md border text-[var(--font-color)]">
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
        {onCreate && (
          <Button
            className="m-2 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            onClick={onCreate}
          >
            {t("Create")}
          </Button>
        )}
        <Button
          className="m-2 bg-sky-600 hover:bg-sky-700 text-white cursor-pointer"
          disabled={
            selectedRow &&
            Object.keys(selectedRow).length > 0 &&
            table.getSelectedRowModel().rows.length === 1
              ? false
              : true
          }
          onClick={() => {
            //@ts-ignore
            onEdit(selectedRow.id)
          }}
        >
          {t("Edit")}
        </Button>
        <AlertDialogComponent
          dialogButtonText={t("Delete")}
          dialogButtonClassName="m-2 bg-rose-600 hover:bg-rose-700 text-white w-16 p-1 rounded-md text-sm cursor-pointer"
          onDelete={() => {
            //@ts-ignore
            onDelete(selectedRow.id)
          }}
          dialogButtonDisabled={
            selectedRow &&
            Object.keys(selectedRow).length > 0 &&
            table.getSelectedRowModel().rows.length === 1
              ? false
              : true
          }
          alertTitle={t("DeleteDialogTitle")}
          dialogActionClassName="bg-rose-600 hover:bg-rose-700 text-white"
          dialogActionButtonText={t("Delete")}
        />
      </div>
    </div>
  )
}
