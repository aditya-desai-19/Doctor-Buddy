import express from "express"
import { authenticateDoctor, registerDoctor } from "../controllers/doctor.controller"

const doctorRouter = express.Router()

//@ts-ignore
doctorRouter.post("/sign-up", registerDoctor)
//@ts-ignore
doctorRouter.post("/login", authenticateDoctor)

export default doctorRouter
