import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeletePlace = z.object({
  id: z.number(),
});

export default resolver.pipe(resolver.zod(DeletePlace), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const place = await db.place.deleteMany({ where: { id } });

  return place;
});
