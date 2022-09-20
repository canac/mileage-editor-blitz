import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createReport from "app/reports/mutations/createReport";
import { ReportForm, FORM_ERROR } from "app/reports/components/ReportForm";

const NewReportPage = () => {
  const router = useRouter();
  const [createReportMutation] = useMutation(createReport);

  return (
    <Layout title={"Create New Report"}>
      <h1>Create New Report</h1>

      <ReportForm
        submitText="Create Report"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateReport}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const report = await createReportMutation(values);
            await router.push(Routes.ShowReportPage({ reportId: report.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.ReportsPage()}>
          <a>Reports</a>
        </Link>
      </p>
    </Layout>
  );
};

NewReportPage.authenticate = true;

export default NewReportPage;
