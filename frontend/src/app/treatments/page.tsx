
import { getPatients } from '@/api/action'
import ListView from "./main"

export default async function Patients() {
  const data = await getPatients()
  return (
    <div className="h-9/10 p-10">
      <ListView data={data}/>
    </div>
  )
}