import express from "express"
import { createTreatment, deleteTreatment, getPaginatedTreatments, getTreatmentById, updateTreatment } from "../controllers/treatment.controller"
import { verifyToken } from "../middlewares/verifyAccessToken.middleware"

const treatmentRouter = express.Router()

//@ts-ignore
treatmentRouter.get("/", verifyToken(), getPaginatedTreatments)
//@ts-ignore
treatmentRouter.post("/", verifyToken(), createTreatment)
//@ts-ignore
treatmentRouter.get("/:id", verifyToken(), getTreatmentById)
//@ts-ignore
treatmentRouter.put("/:id", verifyToken(), updateTreatment)
//@ts-ignore
treatmentRouter.delete("/:id", verifyToken(), deleteTreatment)


export default treatmentRouter
