import { resolver } from "@blitzjs/rpc";
import db from "db";
import { createPlaceSchema } from "../validators/create";

export default resolver.pipe(
  resolver.zod(createPlaceSchema),
  resolver.authorize(),
  async (input, ctx) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const place = await db.place.create({ data: { ...input, userId: ctx.session.userId } });

    return place;
  },
);
