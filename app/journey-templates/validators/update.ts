import { z } from "zod";
import { createJourneyTemplateSchema } from "./create";

export const updateJourneyTemplateSchema = createJourneyTemplateSchema.partial().extend({
  id: z.number(),
});
export type UpdateJourneyTemplate = z.infer<typeof updateJourneyTemplateSchema>;
