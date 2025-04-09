import { Response } from "express"
import { CustomRequest } from "../common/types"
import prisma from "../db/db"
import { getTreatment } from "./treatment.controller"
import { paths } from "../../_openapi_generated/schema"

type CreatePaymentRequest =
  paths["/api/payment/"]["post"]["requestBody"]["content"]["application/json"]

type GetPaymentRequest =
  paths["/api/payment/"]["get"]["parameters"]["query"]

type PaginatedPaymentResponse =
  paths["/api/payment/"]["get"]["responses"]["200"]["content"]["application/json"]

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

export const getPaymentById = async (
  req: CustomRequest,
  res: Response
) => {
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

    if(!result) {
      return res.status(404).json({message: "Payment not found"})
    }

    return res.status(200).json({...result})
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

export const getPaginatedPayments = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    const { page, limit, treatmentId } = req.query
    const query: GetPaymentRequest = {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      treatmentId: `${treatmentId}`
    }

    if (!query.page || !query.limit || !query.treatmentId) {
      return res.status(400).json({ error: "Missing required fields" })
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
              isDeleted: false
            }
          }
        }
      }
    })

    const result: PaginatedPaymentResponse = {}

    const data = await prisma.payment.findMany({
      where: {
        treatmentId: query.treatmentId,
        isDeleted: false,
        treatment: {
          isDeleted: false,
          patient: {
            isDeleted: false,
            doctor: {
              isDeleted: false
            }
          }
        }
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

