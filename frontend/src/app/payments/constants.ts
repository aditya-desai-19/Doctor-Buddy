import { z } from "zod";

export const formSchema = z.object({
  amount: z.number(),
})