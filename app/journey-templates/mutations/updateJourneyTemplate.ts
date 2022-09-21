import { resolver } from "@blitzjs/rpc";
import db from "db";
import { updateJourneyTemplateSchema } from "../validators/update";

export default resolver.pipe(
  resolver.zod(updateJourneyTemplateSchema),
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
