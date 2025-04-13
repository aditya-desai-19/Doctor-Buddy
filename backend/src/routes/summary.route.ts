import express from "express"
import { verifyToken } from "../middlewares/verifyAccessToken.middleware"
import { getSummary } from "../controllers/summary.controller"

const summaryRouter = express.Router()

//@ts-ignore
summaryRouter.get("/", verifyToken(), getSummary)

export default summaryRouter
