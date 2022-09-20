import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateJourney = z.object({
  date: z.date(),
  description: z.string(),
  from: z.string(),
  to: z.string(),
  distance: z.number().int().nonnegative(),
  tolls: z.number().int().nonnegative(),
  reportId: z.number().int().nonnegative(),
});

export default resolver.pipe(
  resolver.zod(CreateJourney),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journey = await db.journey.create({ data: input });

    return journey;
  },
);
