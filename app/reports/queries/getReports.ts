import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetReportsInput
  extends Pick<Prisma.ReportFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetReportsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: reports,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.report.count({ where }),
      query: (paginateArgs) => db.report.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      reports,
      nextPage,
      hasMore,
      count,
    };
  },
);
