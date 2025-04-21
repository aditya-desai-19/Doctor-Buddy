"use server"

import { ACCESS_TOKEN_KEY } from "@/common/constants"
import { UpdatePatientWithIdRequest } from "@/common/types"
import { cookies } from "next/headers"
import {
  ApiPatientPost201Response,
  CreateDoctorRequest,
  CreatePatientRequest,
  DefaultApi,
  DoctorInfoResponse,
  LoginDoctorRequest,
  PaginatedPatientResponse,
  PatientInfo,
  Summary,
  UpdateDoctorInfoRequest,
} from "../../generated"
import apiClient from "./client"

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
      const cookieStore = await cookies()
      cookieStore.set(ACCESS_TOKEN_KEY, result.data.token!, {
        maxAge: 60 * 60 * 24,
      })
      return true
    }
    throw new Error("Login api failure")
  } catch (error) {
    console.error(error)
    return false
  }
}

const getApiClientWithToken = async (): Promise<DefaultApi | null> => {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)
    return apiClient(accessToken?.value)
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getSummary = async (): Promise<Summary | null> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const result = await clientInstance.apiSummaryGet()
    if (result.status === 200) {
      return result.data
    }
    throw new Error("Failed to fetch summary")
  }
  throw new Error("Failed to get api client")
}

export const getPatients =
  async (): Promise<PaginatedPatientResponse | null> => {
    try {
      const clientInstance = await getApiClientWithToken()
      if (clientInstance) {
        const result = await clientInstance.apiPatientGet(1, 10)
        if (result.status === 200) {
          return result.data
        }
      }
      throw new Error("Failed to get api client")
    } catch (error) {
      console.error(error)
      return null
    }
  }

export const createPatient = async (
  data: CreatePatientRequest
): Promise<ApiPatientPost201Response | null> => {
  try {
    const clientInstance = await getApiClientWithToken()
    if (clientInstance) {
      const response = await clientInstance.apiPatientPost(data)
      if (response.status === 201) {
        return response.data
      }
      throw new Error("Failed to create patient")
    }
    throw new Error("Failed to get api client")
  } catch (error) {
    console.error(error)
    return null
  }
}

export const updatePatient = async (
  data: UpdatePatientWithIdRequest
): Promise<boolean | null> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const { firstName, lastName, email, contactNumber, id } = data
    const newData = {
      firstName,
      lastName,
      email,
      contactNumber,
    }
    const response = await clientInstance.apiPatientIdPut(id, newData)
    if (response.status === 200) {
      return true
    }
    throw new Error("Failed to create patient")
  }
  throw new Error("Failed to get api client")
}

export const getPatient = async (id: string): Promise<PatientInfo> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiPatientIdGet(id)
    if (response.status === 200) {
      return response.data
    }
    throw new Error("Failed to get patient")
  }
  throw new Error("Failed to get api client")
}

export const deletePatient = async (id: string): Promise<boolean> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiPatientIdDelete(id)
    if (response.status === 200) {
      return true
    }
  }
  throw new Error("Failed to get api client")
}

export const searchPatient = async (
  text: string
): Promise<PaginatedPatientResponse> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiPatientSearchGet(1, 10, text)
    if (response.status === 200) {
      console.log({ data: response.data })
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

export const getDoctorDetails = async (): Promise<DoctorInfoResponse | null> => {
  try {
    const clientInstance = await getApiClientWithToken()
    if (clientInstance) {
      const response = await clientInstance.apiDoctorGet()
      if (response.status === 200) {
        return response.data
      }
    }
    throw new Error("Failed to get api client")
  } catch (error) {
    console.error(error)
    return null
  }
}

export const handleLogout = async() => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(ACCESS_TOKEN_KEY)
  } catch (error) {
    console.error(error)
  }
}

//todo improve spec redundant type UpdateDoctorInfoRequest
export const saveDoctorInfo = async(values: UpdateDoctorInfoRequest) => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiDoctorPut(values)
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}
