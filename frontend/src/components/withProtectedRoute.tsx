"use client"

import { useLoginStore } from "@/zustand/useLoginStore"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const withProtectedRoute = (WrappedComponent: React.FC) => {
  return function ProtectedComponent() {
    const isLoggedIn = useLoginStore((state) => state.isLoggedIn)
    const router = useRouter()

    useEffect(() => {
      if (!isLoggedIn) {
        router.push("/")
      }
    }, [isLoggedIn, router])

    if (isLoggedIn) {
      return null
    }

    if (!isLoggedIn) {
      return null
    }

    return <WrappedComponent />
  }
}

export default withProtectedRoute
