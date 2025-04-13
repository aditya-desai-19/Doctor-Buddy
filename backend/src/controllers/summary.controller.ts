import { Response } from "express"
import { CustomRequest } from "../common/types"
import prisma from "../db/db"
import { paths } from "../../_openapi_generated/schema"

type Summary =
  paths["/api/summary"]["get"]["responses"]["200"]["content"]["application/json"]

export const getSummary = async (req: CustomRequest, res: Response) => {
  try {
    const totalPatients = await prisma.patient.count({
      where: {
        isDeleted: false,
        doctor: {
          isDeleted: false,
          id: req.user.doctorId,
        },
      },
    })

    const totalTreatments = await prisma.treatment.count({
      where: {
        isDeleted: false,
        patient: {
          isDeleted: false,
          doctor: {
            isDeleted: false,
            id: req.user.doctorId,
          },
        },
      },
    })

    const totalPayments = await prisma.payment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        isDeleted: false,
        treatment: {
          isDeleted: false,
          patient: {
            isDeleted: false,
            doctor: {
              isDeleted: false,
              id: req.user.doctorId,
            },
          },
        },
      },
    })

    const result: Summary = {
      totalPatients,
      totalTreatments,
      totalPayments: totalPayments._sum.amount || 0,
    }

    return res.status(200).json({ ...result })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Something went wrong" })
  }
}
