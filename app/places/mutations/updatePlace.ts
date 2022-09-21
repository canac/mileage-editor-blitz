import { resolver } from "@blitzjs/rpc";
import db from "db";
import { updatePlaceSchema } from "../validators/update";

export default resolver.pipe(
  resolver.zod(updatePlaceSchema),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const place = await db.place.update({ where: { id }, data });

    return place;
  },
);
