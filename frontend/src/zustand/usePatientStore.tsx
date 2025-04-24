import { create } from 'zustand'
import { PatientInfo } from '../../generated'

type State = {
  patients: PatientInfo[],
  selectedPatientId: string,
  setPatients: (data: PatientInfo[]) => void,
  removePatient: (id: string) => void,
  setSelectedPatient: (id: string) => void
}

export const usePatientStore = create<State>()((set, get) => ({
  patients: [],
  selectedPatientId: "",
  setPatients: (data: PatientInfo[]) => set(() => ({patients: data})),
  removePatient: (id: string) => set(() => ({patients: get().patients.filter(x => x.id !== id)})),
  setSelectedPatient: (id: string) => set(() => ({selectedPatientId: id})),
}))
