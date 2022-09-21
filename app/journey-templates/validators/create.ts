import { z } from "zod";

export const createJourneyTemplateSchema = z.object({
  name: z.string(),
  description: z.string(),
  from: z.string(),
  to: z.string(),
  distance: z.number().int().nonnegative(),
  tolls: z.number().int().nonnegative(),
});
export type CreateJourneyTemplate = z.infer<typeof createJourneyTemplateSchema>;
