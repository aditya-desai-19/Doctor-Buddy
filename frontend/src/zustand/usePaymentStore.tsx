import { create } from 'zustand'

type State = {
  treatmentId: string,
  setTreatmentId: (id: string) => void
}

export const usePaymentStore = create<State>()((set) => ({
  treatmentId: "",
  setTreatmentId: (id: string) => set(() => ({treatmentId: id}))
}))
