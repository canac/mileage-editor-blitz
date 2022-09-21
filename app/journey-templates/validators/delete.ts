import { z } from "zod";

export const deleteJourneyTemplateSchema = z.object({
  id: z.number(),
});
