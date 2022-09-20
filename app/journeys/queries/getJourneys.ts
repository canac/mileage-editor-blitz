import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetJourneysInput
  extends Pick<Prisma.JourneyFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetJourneysInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: journeys,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.journey.count({ where }),
      query: (paginateArgs) => db.journey.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      journeys,
      nextPage,
      hasMore,
      count,
    };
  },
);
