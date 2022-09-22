import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateReport = z.object({
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(CreateReport),
  resolver.authorize(),
  async (input, ctx) => {
    const report = await db.report.create({ data: { ...input, userId: ctx.session.userId } });

    return report;
  },
);
