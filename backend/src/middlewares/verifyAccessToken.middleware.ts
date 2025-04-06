import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { CustomRequest } from "../common/types"

const SECRET_KEY = process.env.SECRET_KEY || "doctorBuddy"

type JWTPayload = {
  user: {
    name: string
    id: string
  }
  exp: number
  iat: number
}

export const verifyToken = () => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"]

    if (!authHeader) {
      return res.status(401).json({ message: "Please authenticate yourself" })
    }

    const token = authHeader.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "No token provided" })
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error({ err })
        return res.status(403).json({ message: "Invalid token" })
      }
      const decodedInfo = decoded as JWTPayload
      req.user = { doctorId: decodedInfo.user.id }
      next()
    })
  }
}
