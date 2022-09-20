import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetJourneyTemplatesInput
  extends Pick<Prisma.JourneyTemplateFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetJourneyTemplatesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: journeyTemplates,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.journeyTemplate.count({ where }),
      query: (paginateArgs) => db.journeyTemplate.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      journeyTemplates,
      nextPage,
      hasMore,
      count,
    };
  },
);
