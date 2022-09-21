import { z } from "zod";
import { createPlaceSchema } from "./create";

export const updatePlaceSchema = createPlaceSchema.partial().extend({
  id: z.number(),
});
export type UpdatePlace = z.infer<typeof updatePlaceSchema>;
