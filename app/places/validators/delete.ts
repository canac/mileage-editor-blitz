import { z } from "zod";

export const deletePlaceSchema = z.object({
  id: z.number(),
});
export type DeletePlace = z.infer<typeof deletePlaceSchema>;
