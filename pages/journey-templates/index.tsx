import { Suspense } from "react";
import Head from "next/head";
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getJourneyTemplates from "app/journey-templates/queries/getJourneyTemplates";
import { JourneyTemplateForm } from "app/journey-templates/components/JourneyTemplateForm";
import { Button, Title } from "@mantine/core";
import createJourneyTemplate from "app/journey-templates/mutations/createJourneyTemplate";

const ITEMS_PER_PAGE = 100;

export const JourneyTemplatesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ journeyTemplates, hasMore }, { refetch }] = usePaginatedQuery(getJourneyTemplates, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const [createJourneyTemplateMutation] = useMutation(createJourneyTemplate);

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  async function addTemplate() {
    await createJourneyTemplateMutation({
      name: "",
      description: "",
      to: "",
      from: "",
      distance: 0,
      tolls: 0,
    });
    await refetch();
  }

  return (
    <div>
      <Title order={1} style={{ textAlign: "center", marginBottom: "1em" }}>
        Journey Templates
      </Title>

      {journeyTemplates.map((journeyTemplate) => (
        <JourneyTemplateForm
          key={journeyTemplate.id}
          journeyTemplate={journeyTemplate}
          onDelete={() => refetch()}
          style={{ marginBottom: "1em" }}
        />
      ))}

      <div style={{ marginBottom: "1em" }}>
        <Button
          type="submit"
          variant="filled"
          color="green"
          onClick={() => addTemplate()}
          style={{ alignSelf: "flex-end" }}
        >
          Create new journey template
        </Button>
      </div>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const JourneyTemplatesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Journey Templates</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <JourneyTemplatesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default JourneyTemplatesPage;
