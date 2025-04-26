import { Response } from "express"
import { CustomRequest } from "../common/types"
import prisma from "../db/db"
import { getTreatment } from "./treatment.controller"
import { paths } from "../../_openapi_generated/schema"

type CreatePaymentRequest =
  paths["/api/payment/"]["post"]["requestBody"]["content"]["application/json"]

type GetPaymentRequest = paths["/api/payment/"]["get"]["parameters"]["query"]

type PaginatedPaymentResponse =
  paths["/api/payment/"]["get"]["responses"]["200"]["content"]["application/json"]

type Payment = paths["/api/payment/"]["get"]["responses"]["200"]["content"]["application/json"]["data"]

export const createPayment = async (req: CustomRequest, res: Response) => {
  try {
    const { amount, treatmentId }: CreatePaymentRequest = req.body

    if (!amount || !treatmentId) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const treatment = await getTreatment(treatmentId)

    if (!treatment) {
      return res.status(400).json({ error: "Treatment does not exist" })
    }

    const payment = await prisma.payment.create({
      data: {
        amount,
        treatmentId,
        isDeleted: false,
      },
    })

    return res.status(200).json({ id: payment.id })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to create payment" })
  }
}

export const getPaymentById = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.params.id

    const result = await prisma.payment.findUnique({
      where: {
        id,
        isDeleted: false,
        treatment: {
          isDeleted: false,
          patient: {
            isDeleted: false,
            doctor: {
              isDeleted: false,
            },
          },
        },
      },
    })

    if (!result) {
      return res.status(404).json({ message: "Payment not found" })
    }

    return res.status(200).json({ ...result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to retrieve payments" })
  }
}

export const updatePayment = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.params.id
    const { amount } = req.body

    await prisma.payment.update({
      where: {
        id,
        isDeleted: false,
        treatment: {
          isDeleted: false,
          patient: {
            isDeleted: false,
            doctor: {
              isDeleted: false,
            },
          },
        },
      },
      data: { amount },
    })

    return res
      .status(200)
      .json({ message: "Successfully updated payment information" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to update payment" })
  }
}

export const deletePayment = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.params.id

    await prisma.payment.update({
      where: {
        id,
        isDeleted: false,
        treatment: {
          isDeleted: false,
          patient: {
            isDeleted: false,
            doctor: {
              isDeleted: false,
            },
          },
        },
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return res.status(200).json({ message: "Successfully deleted treatment" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Failed to delete payment" })
  }
}

export const getPaymentsByTreatmentId = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { page, limit, treatmentId } = req.query
    const query: GetPaymentRequest = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      treatmentId: `${treatmentId}`,
    }

    const totalCount = await prisma.payment.count({
      where: {
        treatmentId: query.treatmentId,
        isDeleted: false,
        treatment: {
          isDeleted: false,
          patient: {
            isDeleted: false,
            doctor: {
              isDeleted: false,
            },
          },
        },
      },
    })

    const result: PaginatedPaymentResponse = {}
    const params: any[] = [req.user.doctorId]

    let sql = `
    SELECT p.id, p.amount , t."name", p2."firstName", p2."lastName", p."createdAt"
    FROM "Payment" p 
    JOIN "Treatment" t on p."treatmentId" = t.id and t."isDeleted" = false
    JOIN "Patient" p2 on t."patientId" = p2.id and p2."isDeleted" = false
    `

    if (query.treatmentId !== "undefined") {
      params.push(query.treatmentId)

      sql += `
        WHERE t.id = $${params.length}
      `
    }

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
    const data: Payment = rawData.map(row => ({
      id: row.id,
      amount: row.amount,
      treatmentName: row.name,
      patientName: `${row.firstName} ${row.lastName}`,
      createdAt: row.createdAt
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
  } catch (err) {
    console.error("Error fetching treatments:", err)
    res.status(500).json({ error: "Internal server error" })
  }
}
