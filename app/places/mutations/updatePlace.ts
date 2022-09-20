import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdatePlace = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdatePlace),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const place = await db.place.update({ where: { id }, data });

    return place;
  },
);
