import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getJourneys from "app/journeys/queries/getJourneys";

const ITEMS_PER_PAGE = 100;

export const JourneysList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ journeys, hasMore }] = usePaginatedQuery(getJourneys, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {journeys.map((journey) => (
          <li key={journey.id}>
            <Link href={Routes.ShowJourneyPage({ journeyId: journey.id })}>
              <a>
                {journey.from} - {journey.to}
              </a>
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const JourneysPage = () => {
  return (
    <Layout>
      <Head>
        <title>Journeys</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewJourneyPage()}>
            <a>Create Journey</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <JourneysList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default JourneysPage;
