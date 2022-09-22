import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const GetReport = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.number().optional().refine(Boolean, "Required"),
});

export default resolver.pipe(resolver.zod(GetReport), resolver.authorize(), async ({ id }, ctx) => {
  return db.report.findFirstOrThrow({
    where: { id, userId: ctx.session.userId },
    include: { journeys: true },
  });
});
