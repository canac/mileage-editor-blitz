import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateReport = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateReport),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const report = await db.report.updateMany({
      where: { id, userId: ctx.session.userId },
      data,
    })[0];

    return report;
  },
);
