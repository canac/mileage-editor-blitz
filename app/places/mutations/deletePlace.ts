import { resolver } from "@blitzjs/rpc";
import db from "db";
import { deletePlaceSchema } from "../validators/delete";

export default resolver.pipe(
  resolver.zod(deletePlaceSchema),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const place = await db.place.deleteMany({ where: { id } });

    return place;
  },
);
