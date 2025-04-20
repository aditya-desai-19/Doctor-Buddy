import { create } from 'zustand'
import { PatientInfo } from '../../generated'

type State = {
  patients: PatientInfo[],
  setPatients: (data: PatientInfo[]) => void,
  removePatient: (id: string) => void
}

export const usePatientStore = create<State>()((set, get) => ({
  patients: [],
  setPatients: (data: PatientInfo[]) => set((state) => ({patients: data})),
  removePatient: (id: string) => set((state) => ({patients: get().patients.filter(x => x.id !== id)}))
}))
