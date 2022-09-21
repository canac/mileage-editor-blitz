import { z } from "zod";

export const createPlaceSchema = z.object({
  name: z.string(),
  address: z.string(),
});
export type CreatePlace = z.infer<typeof createPlaceSchema>;
