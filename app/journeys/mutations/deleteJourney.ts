import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

export const deleteJourneySchema = z.object({
  id: z.number(),
});
export type DeleteJourneyInput = z.infer<typeof deleteJourneySchema>;

export default resolver.pipe(
  resolver.zod(deleteJourneySchema),
  resolver.authorize(),
  async ({ id }, ctx) => {
    // Make sure that the user owns the report
    const where = { id, report: { userId: ctx.session.userId } };
    const journey = await db.journey.findFirstOrThrow({ where });
    await db.journey.deleteMany({ where });
    return journey;
  },
);
