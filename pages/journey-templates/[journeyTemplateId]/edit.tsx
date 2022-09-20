import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getJourneyTemplate from "app/journey-templates/queries/getJourneyTemplate";
import updateJourneyTemplate from "app/journey-templates/mutations/updateJourneyTemplate";
import {
  JourneyTemplateForm,
  FORM_ERROR,
} from "app/journey-templates/components/JourneyTemplateForm";

export const EditJourneyTemplate = () => {
  const router = useRouter();
  const journeyTemplateId = useParam("journeyTemplateId", "number");
  const [journeyTemplate, { setQueryData }] = useQuery(
    getJourneyTemplate,
    { id: journeyTemplateId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    },
  );
  const [updateJourneyTemplateMutation] = useMutation(updateJourneyTemplate);

  return (
    <>
      <Head>
        <title>Edit JourneyTemplate {journeyTemplate.id}</title>
      </Head>

      <div>
        <h1>Edit JourneyTemplate {journeyTemplate.id}</h1>
        <pre>{JSON.stringify(journeyTemplate, null, 2)}</pre>

        <JourneyTemplateForm
          submitText="Update JourneyTemplate"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateJourneyTemplate}
          initialValues={journeyTemplate}
          onSubmit={async (values) => {
            try {
              const updated = await updateJourneyTemplateMutation({
                id: journeyTemplate.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(
                Routes.ShowJourneyTemplatePage({
                  journeyTemplateId: updated.id,
                }),
              );
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

const EditJourneyTemplatePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditJourneyTemplate />
      </Suspense>

      <p>
        <Link href={Routes.JourneyTemplatesPage()}>
          <a>JourneyTemplates</a>
        </Link>
      </p>
    </div>
  );
};

EditJourneyTemplatePage.authenticate = true;
EditJourneyTemplatePage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditJourneyTemplatePage;
