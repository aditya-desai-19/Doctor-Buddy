import { create } from 'zustand'
import { DoctorInfoResponse } from '../../generated'


type State = {
  doctorDetails: DoctorInfoResponse,
  initials: string,
  setInitials: (val: string) => void,
  setDoctorDetails: (value: DoctorInfoResponse) => void
}

export const useDoctorStore = create<State>()((set) => ({
  doctorDetails: {
    firstName: "",
    lastName: "",
    email: ""
  },
  initials: "",
  setInitials: (val: string) => set(() => ({initials: val})),
  setDoctorDetails: (value: DoctorInfoResponse) => set(() => ({doctorDetails: value})),
}))
