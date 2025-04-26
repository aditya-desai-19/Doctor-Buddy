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

type TreatmentResponse =
  paths["/api/treatment/{id}"]["get"]["responses"]["200"]["content"]["application/json"]

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
      },
      select: {
        id: true,
        name: true,
        cost: true,
        description: true,
        createdAt: true,
        patientId: true,
        patient: {
          select: {
            firstName: true,
            lastName: true
          }
        }
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

    const formattedResponse: TreatmentResponse = {
      id: treatment.id,
      name: treatment.name,
      description: treatment.description || undefined,
      cost: treatment.cost,
      patientId: treatment.patientId,
      patientName: `${treatment.patient.firstName} ${treatment.patient.lastName}`
    }

    res.status(200).json(formattedResponse)
  } catch (err) {
    console.error("Error fetching treatment:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const updateTreatment = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params
    const { name, cost, description, patientId }: UpdateTreatmentRequest =
      req.body

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
        patientId,
      },
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
      },
    })

    res.status(200).json({ message: "Treatment deleted successfully" })
  } catch (err) {
    console.error("Error deleting treatment:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}

function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
}

export const getPaginatedTreatments = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { page, limit, search } = req.query
    const query: GetTreatmentRequest = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: `${search}`,
    }

    const totalCount = await prisma.treatment.count({
      where: {
        isDeleted: false,
        patient: {
          isDeleted: false,
          doctor: {
            isDeleted: false,
          },
        },
      },
    })

    const result: PaginatedTreatmentResponse = {}
    const params: any[] = [req.user.doctorId]

    let sql = `
    SELECT
    t.id, 
    t."name",
    p."firstName",
    p."lastName",
    p."contactNumber",
    t."cost",
    COALESCE(SUM(p2.amount), 0) AS "totalPaid",
    t."createdAt"
  FROM "Treatment" t
  JOIN "Patient" p ON p.id = t."patientId"
  LEFT JOIN "Payment" p2 ON p2."treatmentId" = t.id AND p2."isDeleted" = false
  WHERE t."isDeleted" = false AND p."isDeleted" = false
`
    if (query.search !== "undefined") {
      params.push(`%${query.search}%`)
      params.push(`%${query.search}%`)
      params.push(`%${query.search}%`)
      params.push(`%${query.search}%`)

      sql += `
      AND (
      LOWER(p."firstName") LIKE $${params.length - 3} OR
      LOWER(p."lastName") LIKE $${params.length - 2} OR
      LOWER(t."name") LIKE $${params.length - 1} OR
      LOWER(p."contactNumber") LIKE $${params.length}
      )
      `
    }

    sql += `
      GROUP BY 
      t.id, 
      t."name", 
      p.id, 
      p."firstName", 
      p."lastName", 
      p."contactNumber", 
      t."cost", 
      t."createdAt"
    `

    if (
      !Number.isNaN(query.limit) &&
      !Number.isNaN(query.page) &&
      query.page !== undefined &&
      query.limit !== undefined
    ) {
      params.push(query.limit)
      params.push((query.page - 1) * query.limit)
      sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`
    }

    const rawData: any[] = await prisma.$queryRawUnsafe(sql, ...params)

    if (query.page !== undefined && query.limit !== undefined) {
      if (query.page > 1 && query.limit < totalCount) {
        result.previous = {
          limit: query.limit,
          page: query.page - 1,
        }
      }
      const currItems = (query.page - 1) * query.limit + query.limit
      if (currItems < totalCount) {
        result.next = {
          limit: query.limit,
          page: query.page + 1,
        }
      }
    }

    result.data = serializeBigInt(rawData)
    return res.status(200).json({ ...result })
  } catch (err) {
    console.error("Error fetching treatments:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}
