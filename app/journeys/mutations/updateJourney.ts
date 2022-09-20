import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateJourney = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateJourney),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journey = await db.journey.updateMany({
      where: { id, report: { userId: ctx.session.userId } },
      data,
    })[0];

    return journey;
  },
);
