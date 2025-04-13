import { create } from 'zustand'

type SummaryState = {
  totalPatients: number
  totalTreatments: number
  totalPayments: number
  setTotalPatients: (value: number) => void
  setTotalTreatments: (value: number) => void
  setTotalPayments: (value: number) => void
}

export const useSummaryStore = create<SummaryState>()((set) => ({
  totalPatients: 100,
  totalTreatments: 100,
  totalPayments: 200000,
  setTotalPatients: (value: number) => set(state => ({totalPatients: value})),
  setTotalTreatments: (value: number) => set(state => ({totalPatients: value})),
  setTotalPayments: (value: number) => set(state => ({totalPatients: value})),
}))
