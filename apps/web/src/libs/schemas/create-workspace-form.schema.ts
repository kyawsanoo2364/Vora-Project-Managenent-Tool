import z from "zod";

export const CreateWorkspaceFormSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().max(500).nullable(),
  logo: z.string().nullable(),
});
