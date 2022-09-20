import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateJourneyTemplate = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateJourneyTemplate),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journeyTemplate = await db.journeyTemplate.update({
      where: { id },
      data,
    });

    return journeyTemplate;
  },
);
