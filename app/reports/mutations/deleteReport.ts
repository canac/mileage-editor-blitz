import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteReport = z.object({
  id: z.number(),
});

export default resolver.pipe(resolver.zod(DeleteReport), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const report = await db.report.deleteMany({ where: { id } });

  return report;
});
