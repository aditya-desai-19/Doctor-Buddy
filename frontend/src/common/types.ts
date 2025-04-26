import { UpdatePatientRequest, UpdateTreatmentRequest } from "../../generated";

export interface UpdatePatientWithIdRequest extends UpdatePatientRequest {
  id: string
}

export interface UpdateTreatmentWithIdRequest extends UpdateTreatmentRequest {
  id: string
}

export type TreatmentRequest = {
  page?: number,
  limit?: number,
  search?: string
}