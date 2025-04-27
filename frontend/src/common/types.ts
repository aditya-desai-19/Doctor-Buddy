import { UpdatePatientRequest, UpdatePaymentRequest, UpdateTreatmentRequest } from "../../generated";

export interface UpdatePatientWithIdRequest extends UpdatePatientRequest {
  id: string
}

export interface UpdateTreatmentWithIdRequest extends UpdateTreatmentRequest {
  id: string
}

export interface CommonRequestQueryParms {
  page?: number,
  limit?: number,
  search?: string
}

export interface PaymentRequest extends CommonRequestQueryParms {
  treatmentId?: string
}

export interface UpdatePaymentWithIdRequest extends UpdatePaymentRequest {
  id: string
}