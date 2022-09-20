import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getJourney from "app/journeys/queries/getJourney";
import updateJourney from "app/journeys/mutations/updateJourney";
import { JourneyForm, FORM_ERROR } from "app/journeys/components/JourneyForm";

export const EditJourney = () => {
  const router = useRouter();
  const journeyId = useParam("journeyId", "number");
  const [journey, { setQueryData }] = useQuery(
    getJourney,
    { id: journeyId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    },
  );
  const [updateJourneyMutation] = useMutation(updateJourney);

  return (
    <>
      <Head>
        <title>Edit Journey {journey.id}</title>
      </Head>

      <div>
        <h1>Edit Journey {journey.id}</h1>
        <pre>{JSON.stringify(journey, null, 2)}</pre>

        <JourneyForm
          submitText="Update Journey"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateJourney}
          initialValues={journey}
          onSubmit={async (values) => {
            try {
              const updated = await updateJourneyMutation({
                id: journey.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(Routes.ShowJourneyPage({ journeyId: updated.id }));
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

const EditJourneyPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditJourney />
      </Suspense>

      <p>
        <Link href={Routes.JourneysPage()}>
          <a>Journeys</a>
        </Link>
      </p>
    </div>
  );
};

EditJourneyPage.authenticate = true;
EditJourneyPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditJourneyPage;
