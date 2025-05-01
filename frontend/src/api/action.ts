"use server"

import { ACCESS_TOKEN_KEY } from "@/common/constants"
import {
  CommonRequestQueryParms,
  PaymentRequest,
  UpdatePatientWithIdRequest,
  UpdatePaymentWithIdRequest,
  UpdateTreatmentWithIdRequest,
} from "@/common/types"
import { cookies } from "next/headers"
import {
  ApiPatientPost201Response,
  CreateDoctorRequest,
  CreatePatientRequest,
  DefaultApi,
  DoctorInfoResponse,
  LoginDoctorRequest,
  PaginatedPatientResponse,
  PaginatedPaymentResponse,
  PaginatedTreatmentResponse,
  PatientInfo,
  Payment,
  PaymentInfo,
  Summary,
  Treatment,
  UpdateDoctorInfoRequest,
  UpdateTreatmentRequest,
} from "../../generated"
import apiClient from "./client"

//auth
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

export const handleLogout = async () => {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(ACCESS_TOKEN_KEY)
  } catch (error) {
    console.error(error)
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

//patient
export const getPatients =
  async (): Promise<PaginatedPatientResponse | null> => {
    try {
      const clientInstance = await getApiClientWithToken()
      if (clientInstance) {
        const result = await clientInstance.apiPatientGet()
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
): Promise<PatientInfo> => {
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
      return response.data
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
    const response = await clientInstance.apiPatientGet(
      undefined,
      undefined,
      text
    )
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

//doctor
export const getDoctorDetails =
  async (): Promise<DoctorInfoResponse> => {
    const clientInstance = await getApiClientWithToken()
    if (clientInstance) {
      const response = await clientInstance.apiDoctorGet()
      if (response.status === 200) {
        return response.data
      }
    }
    throw new Error("Failed to get api client")
  }

//todo improve spec redundant type UpdateDoctorInfoRequest
export const saveDoctorInfo = async (values: UpdateDoctorInfoRequest) => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiDoctorPut(values)
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

//treatment
export const createTreatment = async (data: Treatment) => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiTreatmentPost(data)
    if (response.status === 201) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

export const getTreatmentById = async (id: string): Promise<Treatment> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiTreatmentIdGet(id)
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

export const updateTreatment = async (data: UpdateTreatmentWithIdRequest): Promise<Treatment> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const body: UpdateTreatmentRequest = {
      cost: data.cost,
      name: data.name,
      description: data.description,
      patientId: data.patientId,
    }
    const response = await clientInstance.apiTreatmentIdPut(data.id, body)
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

export const getTreatments = async (
  q: CommonRequestQueryParms
): Promise<PaginatedTreatmentResponse> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiTreatmentGet(
      q.page,
      q.limit,
      q.search
    )
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

export const deletTreatmentById = async (id: string) => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiTreatmentIdDelete(id)
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

//payment
export const createPayment = async (data: Payment) => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiPaymentPost(data)
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

//payments
export const getPayments = async (
  query: PaymentRequest
): Promise<PaginatedPaymentResponse> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiPaymentGet(
      query.page,
      query.limit,
      query.treatmentId,
      query.search
    )
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

export const deletePayment = async (id: string) => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiPaymentIdDelete(id)
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

export const getPayment = async (id: string): Promise<PaymentInfo> => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiPaymentIdGet(id)
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}

export const updatePayment = async (q: UpdatePaymentWithIdRequest) => {
  const clientInstance = await getApiClientWithToken()
  if (clientInstance) {
    const response = await clientInstance.apiPaymentIdPut(q.id, {
      amount: q.amount,
    })
    if (response.status === 200) {
      return response.data
    }
  }
  throw new Error("Failed to get api client")
}
