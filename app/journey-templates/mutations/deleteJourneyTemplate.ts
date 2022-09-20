import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteJourneyTemplate = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteJourneyTemplate),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journeyTemplate = await db.journeyTemplate.deleteMany({
      where: { id },
    });

    return journeyTemplate;
  },
);
