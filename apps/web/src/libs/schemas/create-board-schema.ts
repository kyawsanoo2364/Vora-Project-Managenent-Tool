import z from "zod";

export const CreateBoardSchema = z.object({
  background: z.string().optional(),
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});
