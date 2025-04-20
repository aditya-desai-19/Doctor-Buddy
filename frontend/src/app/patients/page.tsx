
import { getPatients } from '@/api/action'
import {columns} from './columns'
import DataTable from './Datatable'

export default async function Patients() {
  const data = await getPatients()
  return (
    <div className="h-9/10 p-10">
      <DataTable columns={columns} data={data?.data || []} />
    </div>
  )
}