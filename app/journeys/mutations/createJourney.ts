import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

export const createJourneySchema = z.object({
  date: z.string(),
  description: z.string(),
  from: z.string(),
  to: z.string(),
  distance: z.number().int().nonnegative(),
  tolls: z.number().int().nonnegative(),
  reportId: z.number().int().nonnegative(),
});
export type CreateJourneyInput = z.infer<typeof createJourneySchema>;

export default resolver.pipe(
  resolver.zod(createJourneySchema),
  resolver.authorize(),
  async (input, ctx) => {
    // Make sure that the user owns the report
    await db.report.findFirstOrThrow({
      where: { id: input.reportId, userId: ctx.session.userId },
    });
    return db.journey.create({ data: input });
  },
);
