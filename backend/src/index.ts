import express from "express"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import doctorRouter from "./routes/doctor.route"
import patientRouter from "./routes/patient.route"
import treatmentRouter from "./routes/treatment.route"
import paymentRouter from "./routes/payment.route"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
//todo configure 
app.use(cors())

const swaggerDocument = YAML.load("./src/spec.yaml")

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/", (_req, res) => {
  res.send("Hello World")
})

app.use("/api/doctor", doctorRouter)
app.use("/api/patient", patientRouter)
app.use("/api/treatment", treatmentRouter)
app.use("/api/payment", paymentRouter)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
