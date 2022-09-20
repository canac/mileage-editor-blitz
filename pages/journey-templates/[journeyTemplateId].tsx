import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getJourneyTemplate from "app/journey-templates/queries/getJourneyTemplate";
import deleteJourneyTemplate from "app/journey-templates/mutations/deleteJourneyTemplate";

export const JourneyTemplate = () => {
  const router = useRouter();
  const journeyTemplateId = useParam("journeyTemplateId", "number");
  const [deleteJourneyTemplateMutation] = useMutation(deleteJourneyTemplate);
  const [journeyTemplate] = useQuery(getJourneyTemplate, {
    id: journeyTemplateId,
  });

  return (
    <>
      <Head>
        <title>JourneyTemplate {journeyTemplate.id}</title>
      </Head>

      <div>
        <h1>JourneyTemplate {journeyTemplate.id}</h1>
        <pre>{JSON.stringify(journeyTemplate, null, 2)}</pre>

        <Link
          href={Routes.EditJourneyTemplatePage({
            journeyTemplateId: journeyTemplate.id,
          })}
        >
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteJourneyTemplateMutation({ id: journeyTemplate.id });
              await router.push(Routes.JourneyTemplatesPage());
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

const ShowJourneyTemplatePage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.JourneyTemplatesPage()}>
          <a>JourneyTemplates</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <JourneyTemplate />
      </Suspense>
    </div>
  );
};

ShowJourneyTemplatePage.authenticate = true;
ShowJourneyTemplatePage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowJourneyTemplatePage;
