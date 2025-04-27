import { Response } from "express"
import prisma from "../db/db"
import { paths } from "../../_openapi_generated/schema"
import { CustomRequest } from "../common/types"

type CreatePatientRequest =
  paths["/api/patient/"]["post"]["requestBody"]["content"]["application/json"]

type UpdatePatientRequest =
  paths["/api/patient/{id}"]["put"]["requestBody"]["content"]["application/json"]

type GetPatientRequest = paths["/api/patient/"]["get"]["parameters"]["query"]

type PaginatedPatientResponse =
  paths["/api/patient/"]["get"]["responses"]["200"]["content"]["application/json"]

type PatientInfo = paths["/api/patient/{id}"]["put"]["responses"]["200"]["content"]["application/json"]

const getPatient = async (id: string, doctorId: string) => {
  try {
    return await prisma.patient.findUnique({
      where: {
        id,
        doctorId,
        isDeleted: false,
        doctor: {
          isDeleted: false,
        },
      },
    })
  } catch (error) {
    console.error({ error })
    return null
  }
}

const checkDoctorExist = async (doctorId: string) => {
  try {
    await prisma.doctor.findUnique({
      where: {
        id: doctorId,
        isDeleted: false,
      },
    })
    return true
  } catch (error) {
    return null
  }
}

export const createPatient = async (req: CustomRequest, res: Response) => {
  try {
    const { firstName, lastName, contactNumber, email }: CreatePatientRequest =
      req.body

    if (!firstName || !lastName || !contactNumber) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    //add check if doctor exist
    const doctor = await checkDoctorExist(req.user.doctorId)

    if (!doctor) {
      return res.status(404).json({ error: "Doctor does not exist" })
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

    return res.status(201).json({ id: newPatient.id })
  } catch (error) {
    console.error("Error creating patient:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const getPatientById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params

    const patient = await getPatient(id, req.user.doctorId)

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" })
    }

    return res.status(200).json({ ...patient })
  } catch (error) {
    console.error("Error fetching patient:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const updatePatientById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params
    const { firstName, lastName, contactNumber, email }: UpdatePatientRequest =
      req.body

    if (!firstName || !lastName || !contactNumber) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const response: PatientInfo = await prisma.patient.update({
      where: {
        id,
        doctorId: req.user.doctorId,
        isDeleted: false,
        doctor: {
          isDeleted: false,
        },
      },
      data: {
        firstName,
        lastName,
        contactNumber,
        email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        contactNumber: true
      }
    })

    return res
      .status(200)
      .json(response)
  } catch (error) {
    console.error("Error updating patient:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

export const deletePatientById = async (req: CustomRequest, res: Response) => {
  try {
    const { id } = req.params

    const patient = await getPatient(id, req.user.doctorId)

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" })
    }

    await prisma.patient.update({
      where: {
        id,
        doctorId: req.user.doctorId,
        doctor: {
          isDeleted: false,
        },
      },
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

export const getPaginatedPatients = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { page, limit, search } = req.query
    const query: GetPatientRequest = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      search: `${search}`,
    }

    const totalCount = await prisma.patient.count({
      where: {
        isDeleted: false,
        doctor: {
          isDeleted: false,
        },
      },
    })

    const result: PaginatedPatientResponse = {}
    const params: any[] = [req.user.doctorId]

    let sql = `
  SELECT 
    p.id,
    p."firstName",
    p."lastName",
    p."contactNumber",
    p.email,
    p."createdAt",
    COUNT(t.id) AS total_treatments
  FROM "Patient" p  
  LEFT JOIN "Treatment" t ON p.id = t."patientId" and t."isDeleted" = false
  JOIN "Doctor" d ON p."doctorId" = d.id AND d.id = $1
  WHERE d."isDeleted" = false AND p."isDeleted" = false
`

    if (query.search !== "undefined") {
      console.log("inside search")
      params.push(`%${query.search}%`)
      params.push(`%${query.search}%`)
      params.push(`%${query.search}%`)
      params.push(`%${query.search}%`)

      sql += `
  AND (
    LOWER(p."firstName") LIKE $${params.length - 3} OR
    LOWER(p."lastName") LIKE $${params.length - 2} OR
    LOWER(p."email") LIKE $${params.length - 1} OR
    LOWER(p."contactNumber") LIKE $${params.length}
  )
`
    }

    sql += ` GROUP BY p.id`

    if (
      !Number.isNaN(query.limit) &&
      !Number.isNaN(query.page) &&
      query.page !== undefined &&
      query.limit !== undefined
    ) {
      params.push(query.limit)
      params.push((query.page - 1) * query.limit)
      sql += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;
    }

    const rawData: any[] = await prisma.$queryRawUnsafe(sql, ...params)

    const data = rawData.map((row) => ({
      ...row,
      total_treatments: Number(row.total_treatments),
    }))

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

    //@ts-ignore
    result.data = data
    return res.status(200).json({ ...result })
  } catch (error) {
    console.error("Error fetching patient:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}
