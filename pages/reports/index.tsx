import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getReports from "app/reports/queries/getReports";
import { Button, Title } from "@mantine/core";

const ITEMS_PER_PAGE = 100;

export const ReportsList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ reports, hasMore }] = usePaginatedQuery(getReports, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <Title order={1}>Reports</Title>

      <ul>
        {reports.map((report) => (
          <li key={report.id}>
            <Link href={Routes.ShowReportPage({ reportId: report.id })}>
              <a>
                {report.name} ({report.createdAt.getMonth() + 1}-{report.createdAt.getDate()}-
                {report.createdAt.getFullYear()})
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

const ReportsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Reports</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <ReportsList />
        </Suspense>

        <Link href={Routes.NewReportPage()}>
          <Button variant="filled" color="green" style={{ marginTop: "1em" }}>
            New report
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default ReportsPage;
