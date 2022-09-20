import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateJourneyTemplate = z.object({
  name: z.string(),
  description: z.string(),
  from: z.string(),
  to: z.string(),
  distance: z.number().int().nonnegative(),
  tolls: z.number().int().nonnegative(),
});

export default resolver.pipe(
  resolver.zod(CreateJourneyTemplate),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journeyTemplate = await db.journeyTemplate.create({
      data: { ...input, userId: ctx.session.userId },
    });

    return journeyTemplate;
  },
);
