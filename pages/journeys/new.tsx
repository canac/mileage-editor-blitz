import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createJourney from "app/journeys/mutations/createJourney";
import { JourneyForm, FORM_ERROR } from "app/journeys/components/JourneyForm";

const NewJourneyPage = () => {
  const router = useRouter();
  const [createJourneyMutation] = useMutation(createJourney);

  return (
    <Layout title={"Create New Journey"}>
      <h1>Create New Journey</h1>

      <JourneyForm
        submitText="Create Journey"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateJourney}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const journey = await createJourneyMutation(values);
            await router.push(Routes.ShowJourneyPage({ journeyId: journey.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.JourneysPage()}>
          <a>Journeys</a>
        </Link>
      </p>
    </Layout>
  );
};

NewJourneyPage.authenticate = true;

export default NewJourneyPage;
