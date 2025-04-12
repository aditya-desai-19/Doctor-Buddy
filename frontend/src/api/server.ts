"use server"

import { CreateDoctorRequest, LoginDoctorRequest } from "../../generated"
import apiClient from "./client"

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
