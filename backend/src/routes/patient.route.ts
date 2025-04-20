import express from "express"
import {
  createPatient,
  deletePatientById,
  getFilteredPaginatedPatients,
  getPaginatedPatients,
  getPatientById,
  updatePatientById,
} from "../controllers/patient.controller"
import { verifyToken } from "../middlewares/verifyAccessToken.middleware"

const patientRouter = express.Router()

//@ts-ignore
patientRouter.get("/", verifyToken(), getPaginatedPatients)
//@ts-ignore
patientRouter.get("/search", verifyToken(), getFilteredPaginatedPatients)
//@ts-ignore
patientRouter.post("/", verifyToken(), createPatient)
//@ts-ignore
patientRouter.get("/:id", verifyToken(), getPatientById)
//@ts-ignore
patientRouter.put("/:id", verifyToken(), updatePatientById)
//@ts-ignore
patientRouter.delete("/:id", verifyToken(), deletePatientById)

export default patientRouter
