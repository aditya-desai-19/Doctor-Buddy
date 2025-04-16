"use server"

import { CreateDoctorRequest, LoginDoctorRequest, Summary } from "../../generated"
import apiClient from "./client"
import { cookies } from 'next/headers'

const apiClientInstance = apiClient()

export const handleSignUp = async (data: CreateDoctorRequest): Promise<boolean> => {
  try {
    const result = await apiClientInstance.apiDoctorSignUpPost(data)
    if(result.status === 201) {
      return true
    }
    throw new Error("Sign up api failure")
  } catch (error) {
    console.error(error)
    return false
  }
}


export const handleLogin = async (data: LoginDoctorRequest): Promise<boolean> => {
  try {
    const result = await apiClientInstance.apiDoctorLoginPost(data)
    if(result.status === 200) {
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
    const at = cookieStore.get('access_token')
    const result = await apiClientInstance.apiSummaryGet()
    console.log({result})
    if(result.status === 200) {
      return result.data
    }
    throw new Error("Failed to fetch summary")
  } catch (error) {
    console.error(error)
    return null
  }
}
