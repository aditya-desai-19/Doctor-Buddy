import express from "express"
import {
  authenticateDoctor,
  getDoctorById,
  registerDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller"
import { verifyToken } from "../middlewares/verifyAccessToken.middleware"

const doctorRouter = express.Router()

//@ts-ignore
doctorRouter.post("/sign-up", registerDoctor)
//@ts-ignore
doctorRouter.post("/login", authenticateDoctor)
//@ts-ignore
doctorRouter.get("/", verifyToken(), getDoctorById)
//@ts-ignore
doctorRouter.put("/", verifyToken(), updateDoctor)
//@ts-ignore
doctorRouter.delete("/", verifyToken(), deleteDoctor)

export default doctorRouter
