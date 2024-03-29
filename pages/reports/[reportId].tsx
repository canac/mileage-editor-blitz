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
import createJourney from "app/journeys/mutations/createJourney";
import { FaIcon } from "app/core/components/FaIcon";
import { faPrint, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ActionIcon, Button, Title } from "@mantine/core";
import { JourneyForm } from "app/journeys/components/JourneyForm";
import getPlaces from "app/places/queries/getPlaces";
import getJourneyTemplates from "app/journey-templates/queries/getJourneyTemplates";

export const Report = () => {
  const router = useRouter();
  const reportId = useParam("reportId", "number");
  const [createJourneyMutation] = useMutation(createJourney);
  const [deleteReportMutation] = useMutation(deleteReport);
  const [{ places }] = useQuery(getPlaces, {});
  const [{ journeyTemplates }] = useQuery(getJourneyTemplates, {});
  const [report, { refetch }] = useQuery(getReport, { id: reportId });

  async function addJourney() {
    await createJourneyMutation({
      date: new Date().toISOString().slice(0, 10), // today
      description: "",
      from: "",
      to: "",
      distance: 0,
      tolls: 0,
      reportId: reportId ?? 0,
    });
    await refetch();
  }

  return (
    <>
      <Head>
        <title>{report.name}</title>
      </Head>

      <main style={{ margin: "1em" }}>
        <Title
          order={1}
          style={{ display: "flex", gap: "0.5em", justifyContent: "center", marginBottom: "1em" }}
        >
          {report.name}

          <Link href={Routes.PrintReportPage({ reportId: reportId?.toString() ?? "" })}>
            <ActionIcon size="lg" style={{ alignSelf: "center" }}>
              <FaIcon icon={faPrint} size="lg" />
            </ActionIcon>
          </Link>

          <ActionIcon color="red" size="lg" style={{ alignSelf: "center" }}>
            <FaIcon
              icon={faTrash}
              size="lg"
              onClick={async () => {
                if (window.confirm("This will be deleted")) {
                  await deleteReportMutation({ id: report.id });
                  await router.push(Routes.ReportsPage());
                }
              }}
            />
          </ActionIcon>
        </Title>

        {report.journeys.map((journey) => (
          <JourneyForm
            key={journey.id}
            journey={journey}
            places={places}
            journeyTemplates={journeyTemplates}
            onChange={() => refetch()}
            style={{ marginBottom: "1em" }}
          />
        ))}

        <Button
          variant="filled"
          color="green"
          onClick={() => addJourney()}
          style={{ alignSelf: "flex-end" }}
        >
          Add journey
        </Button>
      </main>
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
