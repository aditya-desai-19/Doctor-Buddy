"use client"

import { useLoginStore } from "@/zustand/useLoginStore"
import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function Home() {
  const isLoggedIn = useLoginStore(state => state.isLoggedIn)
  
  const router = useRouter()

  useEffect(() => {
    if(!isLoggedIn) {
      router.push("/login")
    }
  }, [isLoggedIn])

  return (
    <>
      <h1>Hello User</h1>
    </>
  )
}
