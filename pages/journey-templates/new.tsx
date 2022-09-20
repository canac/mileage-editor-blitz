import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createJourneyTemplate from "app/journey-templates/mutations/createJourneyTemplate";
import {
  JourneyTemplateForm,
  FORM_ERROR,
} from "app/journey-templates/components/JourneyTemplateForm";

const NewJourneyTemplatePage = () => {
  const router = useRouter();
  const [createJourneyTemplateMutation] = useMutation(createJourneyTemplate);

  return (
    <Layout title={"Create New JourneyTemplate"}>
      <h1>Create New JourneyTemplate</h1>

      <JourneyTemplateForm
        submitText="Create JourneyTemplate"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateJourneyTemplate}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const journeyTemplate = await createJourneyTemplateMutation(values);
            await router.push(
              Routes.ShowJourneyTemplatePage({
                journeyTemplateId: journeyTemplate.id,
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

      <p>
        <Link href={Routes.JourneyTemplatesPage()}>
          <a>JourneyTemplates</a>
        </Link>
      </p>
    </Layout>
  );
};

NewJourneyTemplatePage.authenticate = true;

export default NewJourneyTemplatePage;
