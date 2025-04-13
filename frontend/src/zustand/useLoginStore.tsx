import { create } from 'zustand'

type LoginState = {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
}

export const useLoginStore = create<LoginState>()((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (value: boolean) => set((state) => ({isLoggedIn: value}))
}))
