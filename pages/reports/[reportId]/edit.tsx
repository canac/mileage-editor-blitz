import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getReport from "app/reports/queries/getReport";
import updateReport from "app/reports/mutations/updateReport";
import { ReportForm, FORM_ERROR } from "app/reports/components/ReportForm";

export const EditReport = () => {
  const router = useRouter();
  const reportId = useParam("reportId", "number");
  const [report, { setQueryData }] = useQuery(
    getReport,
    { id: reportId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    },
  );
  const [updateReportMutation] = useMutation(updateReport);

  return (
    <>
      <Head>
        <title>Edit Report {report.id}</title>
      </Head>

      <div>
        <h1>Edit Report {report.id}</h1>
        <pre>{JSON.stringify(report, null, 2)}</pre>

        <ReportForm
          submitText="Update Report"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateReport}
          initialValues={report}
          onSubmit={async (values) => {
            try {
              const updated = await updateReportMutation({
                id: report.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(Routes.ShowReportPage({ reportId: updated.id }));
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditReportPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditReport />
      </Suspense>

      <p>
        <Link href={Routes.ReportsPage()}>
          <a>Reports</a>
        </Link>
      </p>
    </div>
  );
};

EditReportPage.authenticate = true;
EditReportPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditReportPage;
