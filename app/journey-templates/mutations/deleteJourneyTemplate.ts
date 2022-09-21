import { resolver } from "@blitzjs/rpc";
import db from "db";
import { deleteJourneyTemplateSchema } from "../validators/delete";

export default resolver.pipe(
  resolver.zod(deleteJourneyTemplateSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const journeyTemplate = await db.journeyTemplate.deleteMany({
      where: { id },
    });

    return journeyTemplate;
  },
);
