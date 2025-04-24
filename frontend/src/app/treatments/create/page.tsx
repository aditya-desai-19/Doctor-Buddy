import { usePatientStore } from "@/zustand/usePatientStore"
import { useEffect, useState } from "react"
import { PatientInfo } from "../../../../generated"

export default function CreateTreatmentPage () {
  const {selectedPatientId, patients} = usePatientStore(state => state)
  const [patientDetails, setPatientDetails] = useState<PatientInfo>()

  useEffect(() => {
    if(selectedPatientId) {
      const data = patients.filter(x => x.id === selectedPatientId)
      setPatientDetails(data[0])
    }
  }, [selectedPatientId])

  return (
    <div>
      <h2>Treatment create page</h2>
    </div>
  )
}