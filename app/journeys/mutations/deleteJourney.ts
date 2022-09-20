import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteJourney = z.object({
  id: z.number(),
});

export default resolver.pipe(resolver.zod(DeleteJourney), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const journey = await db.journey.deleteMany({ where: { id } });

  return journey;
});
