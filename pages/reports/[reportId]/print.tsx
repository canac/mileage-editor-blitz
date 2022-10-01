import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getReport from "app/reports/queries/getReport";
import { Table, Text, Title } from "@mantine/core";

export const Report = () => {
  const router = useRouter();
  const reportId = useParam("reportId", "number");
  const [report] = useQuery(getReport, { id: reportId });

  function formatMiles(miles: number): string {
    return `${(miles / 10).toFixed(1)}mi`;
  }

  function formatMoney(tolls: number): string {
    return `$${(tolls / 100).toFixed(2)}`;
  }

  const { totalMiles, totalTolls } = report.journeys.reduce(
    ({ totalMiles, totalTolls }, journey) => ({
      totalMiles: totalMiles + journey.distance,
      totalTolls: totalTolls + journey.tolls,
    }),
    { totalMiles: 0, totalTolls: 0 },
  );

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
          {report.name} ({report.createdAt.getMonth() + 1}-{report.createdAt.getDate()}-
          {report.createdAt.getFullYear()})
        </Title>

        <Table>
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th>Date</th>
              <th>Description</th>
              <th>From</th>
              <th>To</th>
              <th>Distance</th>
              <th>Tolls</th>
            </tr>
          </thead>
          <tbody>
            {report.journeys.map((journey) => (
              <tr key={journey.id}>
                <td>{journey.date}</td>
                <td>{journey.description}</td>
                <td>{journey.from}</td>
                <td>{journey.to}</td>
                <td>{formatMiles(journey.distance)}</td>
                <td>{formatMoney(journey.tolls)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div style={{ marginTop: "1em" }}>
          <Text weight="bold">
            Total mileage: {formatMiles(totalMiles)} ({formatMoney(totalMiles * 10 * 0.585)})
          </Text>
        </div>
        <div style={{ marginTop: "0.5em" }}>
          <Text weight="bold">Total tolls: {formatMoney(totalTolls)}</Text>
        </div>
      </main>
    </>
  );
};

const PrintReportPage = () => {
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

PrintReportPage.authenticate = true;
PrintReportPage.getLayout = (page) => <Layout>{page}</Layout>;

export default PrintReportPage;
