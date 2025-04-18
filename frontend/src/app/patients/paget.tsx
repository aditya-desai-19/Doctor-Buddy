"use client"

import { useLoginStore } from "@/zustand/useLoginStore"

export default function Patients() {
  const isLoggedIn = useLoginStore(state => state.isLoggedIn)
  
  if(!isLoggedIn) {
    return <h2>Login first</h2>
  }
  
  return (
    <h2>Patients page</h2>
  )
}