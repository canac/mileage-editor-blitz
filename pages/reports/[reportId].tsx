import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getReport from "app/reports/queries/getReport";
import deleteReport from "app/reports/mutations/deleteReport";

export const Report = () => {
  const router = useRouter();
  const reportId = useParam("reportId", "number");
  const [deleteReportMutation] = useMutation(deleteReport);
  const [report] = useQuery(getReport, { id: reportId });

  return (
    <>
      <Head>
        <title>Report {report.id}</title>
      </Head>

      <div>
        <h1>Report {report.id}</h1>
        <pre>{JSON.stringify(report, null, 2)}</pre>

        <Link href={Routes.EditReportPage({ reportId: report.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteReportMutation({ id: report.id });
              await router.push(Routes.ReportsPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowReportPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.ReportsPage()}>
          <a>Reports</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Report />
      </Suspense>
    </div>
  );
};

ShowReportPage.authenticate = true;
ShowReportPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowReportPage;
