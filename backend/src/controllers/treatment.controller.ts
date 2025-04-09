import { Response } from "express"
import { CustomRequest } from "../common/types"
import prisma from "../db/db"
import { paths } from "../../_openapi_generated/schema"

type CreateTreatmentRequest =
  paths["/api/treatment/"]["post"]["requestBody"]["content"]["application/json"]

type UpdateTreatmentRequest =
  paths["/api/treatment/{id}"]["put"]["requestBody"]["content"]["application/json"]

type GetTreatmentRequest =
  paths["/api/treatment/"]["get"]["parameters"]["query"]

type PaginatedTreatmentResponse =
  paths["/api/treatment/"]["get"]["responses"]["200"]["content"]["application/json"]

const checkPatientExist = async (patientId: string): Promise<boolean> => {
  try {
    await prisma.patient.findUnique({
      where: {
        id: patientId,
        isDeleted: false,
        doctor: {
          isDeleted: false,
        },
      },
    })

    return true
  } catch (error) {
    console.error(error)
    return false
  }
}

export const getTreatment = async (id: string) => {
  try {
    const treatment = await prisma.treatment.findUnique({
      where: {
        id,
        isDeleted: false,
        patient: {
          isDeleted: false,
          doctor: {
            isDeleted: false,
          },
        },
      }
    })

    return treatment
  } catch (error) {
    return null
  }
}

export const createTreatment = async (req: CustomRequest, res: Response) => {
  try {
    const { name, patientId, cost, description }: CreateTreatmentRequest =
      req.body

    if (!name || !patientId || !cost) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const patient = await checkPatientExist(patientId)

    if (!patient) {
      return res.status(400).json({ error: "Patient does not exist" })
    }

    const treatment = await prisma.treatment.create({
      data: {
        name,
        cost,
        patientId,
        description,
        isDeleted: false,
      },
    })

    return res.status(201).json({ id: treatment.id })
  } catch (err) {
    console.error("Error creating treatment:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getTreatmentById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params

    const treatment = await getTreatment(id)

    if (!treatment) {
      return res.status(404).json({ error: "Treatment not found" })
    }

    res.status(200).json(treatment)
  } catch (err) {
    console.error("Error fetching treatment:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const updateTreatment = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name, cost, description }: UpdateTreatmentRequest = req.body

    if (!name || !cost) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const treatment = await getTreatment(id)

    if (!treatment) {
      return res.status(404).json({ error: "Treatment not found" })
    }

    await prisma.treatment.update({
      where: {
        id,
        isDeleted: false,
        patient: {
          isDeleted: false,
          doctor: {
            isDeleted: false,
          },
        },
      },
      data: {
        name,
        cost,
        description,
      }
    })

    res.status(200).json({ message: "Treatment updated successfully" })
  } catch (err) {
    console.error("Error updating treatment:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const deleteTreatment = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params

    const treatment = await getTreatment(id)

    if (!treatment) {
      return res.status(404).json({ error: "Treatment not found" })
    }

    await prisma.treatment.update({
      where: {
        id,
        patient: {
          isDeleted: false,
          doctor: {
            isDeleted: false,
          },
        },
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      }
    })

    res.status(200).json({ message: "Treatment deleted successfully" })
  } catch (err) {
    console.error("Error deleting treatment:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getPaginatedTreatments = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { page, limit, patientId } = req.query
    const query: GetTreatmentRequest = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      patientId: `${patientId}`,
    }

    if (!query.page || !query.limit || !query.patientId) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const totalCount = await prisma.treatment.count({
      where: {
        patientId: query.patientId,
        isDeleted: false,
        patient: {
          isDeleted: false,
          doctor: {
            isDeleted: false
          }
        }
      }
    })

    const result: PaginatedTreatmentResponse = {}

    const data = await prisma.treatment.findMany({
      where: {
        isDeleted: false,
        patientId: query.patientId,
        patient: {
          isDeleted: false,
          doctor: {
            isDeleted: false,
          },
        },
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit
    })

    if (query.page > 1 && query.limit < totalCount) {
      result.previous = {
        limit: query.limit,
        page: query.page - 1,
      }
    }

    const currItems = ((query.page - 1) * query.limit) + query.limit
    if (currItems < totalCount) {
      result.next = {
        limit: query.limit,
        page: query.page + 1,
      }
    }

    //@ts-ignore
    result.data = data
    return res.status(200).json({ ...result })
  } catch (err) {
    console.error("Error fetching treatments:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}
