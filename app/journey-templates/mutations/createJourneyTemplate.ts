import { resolver } from "@blitzjs/rpc";
import db from "db";
import { createJourneyTemplateSchema } from "../validators/create";

export default resolver.pipe(
  resolver.zod(createJourneyTemplateSchema),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journeyTemplate = await db.journeyTemplate.create({
      data: { ...input, userId: ctx.session.userId },
    });

    return journeyTemplate;
  },
);
