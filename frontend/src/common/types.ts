import { UpdatePatientRequest } from "../../generated";

export interface UpdatePatientWithIdRequest extends UpdatePatientRequest {
  id: string
}