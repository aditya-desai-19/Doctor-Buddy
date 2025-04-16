"use server"

import { ACCESS_TOKEN_KEY } from "@/common/constants"
import {
  CreateDoctorRequest,
  LoginDoctorRequest,
  Summary,
} from "../../generated"
import apiClient from "./client"
import { cookies } from "next/headers"


export const handleSignUp = async (
  data: CreateDoctorRequest
): Promise<boolean> => {
  try {
    const result = await apiClient().apiDoctorSignUpPost(data)
    if (result.status === 201) {
      return true
    }
    throw new Error("Sign up api failure")
  } catch (error) {
    console.error(error)
    return false
  }
}

export const handleLogin = async (
  data: LoginDoctorRequest
): Promise<boolean> => {
  try {
    const result = await apiClient().apiDoctorLoginPost(data)
    if (result.status === 200) {
      console.log({ token: result.data })
      const cookieStore = await cookies()
      cookieStore.set(ACCESS_TOKEN_KEY, result.data.token!, {
        maxAge: 60 * 60 * 24 * 1000,
      })
      return true
    }
    throw new Error("Login api failure")
  } catch (error) {
    console.error(error)
    return false
  }
}

export const getSummary = async (): Promise<Summary | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)
    const clientInstance = apiClient(accessToken?.value)
    const result = await clientInstance.apiSummaryGet()
    if (result.status === 200) {
      return result.data
    }
    throw new Error("Failed to fetch summary")
  } catch (error) {
    console.error(error)
    return null
  }
}
