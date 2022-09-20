import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getJourneyTemplates from "app/journey-templates/queries/getJourneyTemplates";

const ITEMS_PER_PAGE = 100;

export const JourneyTemplatesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ journeyTemplates, hasMore }] = usePaginatedQuery(getJourneyTemplates, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {journeyTemplates.map((journeyTemplate) => (
          <li key={journeyTemplate.id}>
            <Link
              href={Routes.ShowJourneyTemplatePage({
                journeyTemplateId: journeyTemplate.id,
              })}
            >
              <a>{journeyTemplate.name}</a>
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

const JourneyTemplatesPage = () => {
  return (
    <Layout>
      <Head>
        <title>JourneyTemplates</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewJourneyTemplatePage()}>
            <a>Create JourneyTemplate</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <JourneyTemplatesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default JourneyTemplatesPage;
