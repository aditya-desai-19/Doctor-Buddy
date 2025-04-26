
import { getTreatments } from '@/api/action'
import ListView from "./main"

export default async function Patients() {
  const data = await getTreatments({})
  return (
    <div className="h-9/10 p-10">
      <ListView data={data}/>
    </div>
  )
}