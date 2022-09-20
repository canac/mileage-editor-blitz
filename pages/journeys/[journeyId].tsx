import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getJourney from "app/journeys/queries/getJourney";
import deleteJourney from "app/journeys/mutations/deleteJourney";

export const Journey = () => {
  const router = useRouter();
  const journeyId = useParam("journeyId", "number");
  const [deleteJourneyMutation] = useMutation(deleteJourney);
  const [journey] = useQuery(getJourney, { id: journeyId });

  return (
    <>
      <Head>
        <title>Journey {journey.id}</title>
      </Head>

      <div>
        <h1>Journey {journey.id}</h1>
        <pre>{JSON.stringify(journey, null, 2)}</pre>

        <Link href={Routes.EditJourneyPage({ journeyId: journey.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteJourneyMutation({ id: journey.id });
              await router.push(Routes.JourneysPage());
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

const ShowJourneyPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.JourneysPage()}>
          <a>Journeys</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Journey />
      </Suspense>
    </div>
  );
};

ShowJourneyPage.authenticate = true;
ShowJourneyPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowJourneyPage;
