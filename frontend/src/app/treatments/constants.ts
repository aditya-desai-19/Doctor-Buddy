import { z } from "zod"

export const formSchema = z.object({
  patientId: z.string().min(1, "Please select a patient."),
  treatmentName: z.string().min(1, "Treatment name is required."),
  description: z.string().optional(),
  cost: z
    .number({ invalid_type_error: "Cost must be a number" })
    .int("Cost must be an integer")
    .positive("Cost must be greater than 0"),
})

export type FormData = z.infer<typeof formSchema>