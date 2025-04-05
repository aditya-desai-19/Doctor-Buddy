import express from "express"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import doctorRouter from "./routes/doctor.route"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

const swaggerDocument = YAML.load("./src/spec.yaml")

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/", (_req, res) => {
  res.send("Hello World")
})

app.use("/api/doctor", doctorRouter)

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
