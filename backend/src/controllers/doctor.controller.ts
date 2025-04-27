import { paths } from "../../_openapi_generated/schema"
import { Request, Response } from "express"
import prisma from "../db/db"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { CustomRequest } from "../common/types"

const SALT_ROUNDS = 10

type CreateDoctorRequest =
  paths["/api/doctor/sign-up"]["post"]["requestBody"]["content"]["application/json"]

type LoginDoctorRequest =
  paths["/api/doctor/login"]["post"]["requestBody"]["content"]["application/json"]

type DoctorResponse = {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
} | null

type DoctorInfo =
  paths["/api/doctor/{id}"]["get"]["responses"]["200"]["content"]["application/json"]

const checkIfUserExist = async (email: string): Promise<DoctorResponse> => {
  try {
    const response = await prisma.doctor.findFirst({
      where: {
        email,
      },
    })

    return response
  } catch (error) {
    return null
  }
}

export const registerDoctor = async (req: Request, res: Response) => {
  try {
    const body = req.body as CreateDoctorRequest

    if (!body.firstName || !body.lastName || !body.email || !body.password) {
      return res.status(400).json({ message: "All fields are required." })
    }

    //check for unique email
    const isUserPresent = await checkIfUserExist(body.email)
    if (isUserPresent) {
      return res.status(400).json({ message: "Email should be unique" })
    }

    //encrypt password
    const hashedPassword = await bcrypt.hash(body.password, SALT_ROUNDS)

    await prisma.doctor.create({
      data: {
        id: uuidv4(),
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        password: hashedPassword,
        isDeleted: false,
      },
    })

    return res.status(201).json({ message: "Successfully signed up" })
  } catch (error) {
    console.error({ error })
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const authenticateDoctor = async (req: Request, res: Response) => {
  try {
    const body = req.body as LoginDoctorRequest

    if (!body.email || !body.password) {
      return res.status(400).json({ message: "All fields are required." })
    }

    //check if user exist
    const user = await checkIfUserExist(body.email)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    //generate token
    const isMatch = await bcrypt.compare(body.password, user.password)
    if (isMatch && !user.isDeleted) {
      const expiration = Math.floor(Date.now() / 1000) + 60 * 60 * 24
      const userDetails = {
        name: `${user.firstName} ${user.lastName}`,
        id: user.id,
      }
      const secret = process.env.AUTH_SECRET || "doctorBuddy"
      const token = jwt.sign({ user: userDetails, exp: expiration }, secret)
      return res.status(200).json({
        token,
      })
    }
    return res.status(400).json({ message: "Password is incorrect" })
  } catch (error) {
    console.error({ error })
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const getDoctorById = async (req: CustomRequest, res: Response) => {
  try {
    const response: DoctorResponse = await prisma.doctor.findUnique({
      where: {
        id: req.user.doctorId,
      },
    })

    if (response && !response.isDeleted) {
      const result: DoctorInfo = {
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
      }

      return res.status(200).json({ ...result })
    }

    return res.status(404).json({ message: "Doctor not found" })
  } catch (error) {
    console.error({ error })
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const updateDoctor = async (req: CustomRequest, res: Response) => {
  try {
    const { firstName, lastName, email } = req.body

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "All fields are required." })
    }

    const existingDoctor = await prisma.doctor.findUnique({ where: { id: req.user.doctorId } })

    if (!existingDoctor || existingDoctor.isDeleted) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    const response = await prisma.doctor.update({
      where: { id: req.user.doctorId },
      data: {
        firstName,
        lastName,
        email,
      },
    })

    const formattedResponse: DoctorInfo = {
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName
    } 

    return res
      .status(200)
      .json(formattedResponse)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const deleteDoctor = async (req: CustomRequest, res: Response) => {
  try {
    const existingDoctor = await prisma.doctor.findUnique({
      where: { id: req.user.doctorId },
    })

    if (!existingDoctor || existingDoctor.isDeleted) {
      return res.status(404).json({ message: "Doctor not found" })
    }

    await prisma.doctor.update({
      where: { id: req.user.doctorId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return res.status(200).json({ message: "Doctor deleted successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}
