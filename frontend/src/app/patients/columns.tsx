"use client"

import { Checkbox } from "@/components/ui/checkbox"
import {ColumnDef} from "@tanstack/react-table"
import { PatientInfo } from "../../../generated"

export const columns: ColumnDef<PatientInfo>[] = [
  {
    id: "select",
    header: '',
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
    header: "First Name"
  },
  {
    accessorKey: "lastName",
    header: "Last Name"
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number"
  },
  {
    accessorKey: "total_treatments",
    header: "Total treatments"
  }
]