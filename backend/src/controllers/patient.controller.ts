import { Response } from "express"
import prisma from "../db/db"
import { paths } from "../../_openapi_generated/schema"
import { CustomRequest } from "../common/types"

type CreatePatientRequest =
  paths["/api/patient/"]["post"]["requestBody"]["content"]["application/json"]

type UpdatePatientRequest = paths["/api/patient/{id}"]["put"]["requestBody"]["content"]["application/json"]

const getPatient = async (id: string) => {
  try {
    return await prisma.patient.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error({ error })
    return null
  }
}

export const createPatient = async (req: CustomRequest, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      contactNumber,
      email,
    }: CreatePatientRequest = req.body

    if (!firstName || !lastName || !contactNumber) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const newPatient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        contactNumber,
        doctorId: req.user.doctorId,
        email,
        isDeleted: false,
      },
    })

    return res.status(200).json({ id: newPatient.id })
  } catch (error) {
    console.error("Error creating patient:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const getPatientById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params

    const patient = await getPatient(id)

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" })
    }

    if (req.user.doctorId != patient.doctorId) {
      return res.status(403).json({ message: "Unauthorized request" })
    }

    const { firstName, lastName, email, contactNumber } = patient

    return res.status(200).json({ firstName, lastName, email, contactNumber })
  } catch (error) {
    console.error("Error fetching patient:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const updatePatientById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params
    const { firstName, lastName, contactNumber, doctorId, email }: UpdatePatientRequest = req.body

    if (!firstName || !lastName || !contactNumber || !doctorId) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    if (req.user.doctorId != doctorId) {
      return res.status(403).json({ message: "Unauthorized request" })
    }

    await prisma.patient.update({
      where: { id },
      data: {
        firstName,
        lastName,
        contactNumber,
        doctorId,
        email,
      },
    })

    return res
      .status(200)
      .json({ message: "Successfully updated patient information" })
  } catch (error) {
    console.error("Error updating patient:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const deletePatientById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params

    const patient = await getPatient(id)

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" })
    }

    if (req.user.doctorId != patient.doctorId) {
      return res.status(403).json({ message: "Unauthorized request" })
    }

    await prisma.patient.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return res.status(200).json({ message: "Successfully deleted patient" })
  } catch (error) {
    console.error("Error deleting patient:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
