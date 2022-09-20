import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetPlacesInput
  extends Pick<Prisma.PlaceFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPlacesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: places,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.place.count({ where }),
      query: (paginateArgs) => db.place.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      places,
      nextPage,
      hasMore,
      count,
    };
  },
);
