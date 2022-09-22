import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";
import { createJourneySchema } from "./createJourney";

export const updateJourneySchema = createJourneySchema.omit({ reportId: true }).partial().extend({
  id: z.number(),
});
export type UpdateJourneyInput = z.infer<typeof updateJourneySchema>;

export default resolver.pipe(
  resolver.zod(updateJourneySchema),
  resolver.authorize(),
  async ({ id, ...data }, ctx) => {
    // Make sure that the user owns the report
    const where = { id, report: { userId: ctx.session.userId } };
    await db.journey.updateMany({ where, data });
    return db.journey.findFirstOrThrow({ where });
  },
);
