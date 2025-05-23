import express from "express"
import { verifyToken } from "../middlewares/verifyAccessToken.middleware"
import { createPayment, deletePayment, getPaymentsByTreatmentId, getPaymentById, updatePayment } from "../controllers/payment.controller"

const paymentRouter = express.Router()

//@ts-ignore
paymentRouter.get("/", verifyToken(), getPaymentsByTreatmentId)
//@ts-ignore
paymentRouter.post("/", verifyToken(), createPayment)
//@ts-ignore
paymentRouter.get("/:id", verifyToken(), getPaymentById)
//@ts-ignore
paymentRouter.put("/:id", verifyToken(), updatePayment)
//@ts-ignore
paymentRouter.delete("/:id", verifyToken(), deletePayment)


export default paymentRouter
