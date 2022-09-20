import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "app/core/layouts/Layout";
import createPlace from "app/places/mutations/createPlace";
import { PlaceForm, FORM_ERROR } from "app/places/components/PlaceForm";

const NewPlacePage = () => {
  const router = useRouter();
  const [createPlaceMutation] = useMutation(createPlace);

  return (
    <Layout title={"Create New Place"}>
      <h1>Create New Place</h1>

      <PlaceForm
        submitText="Create Place"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreatePlace}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const place = await createPlaceMutation(values);
            await router.push(Routes.ShowPlacePage({ placeId: place.id }));
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.PlacesPage()}>
          <a>Places</a>
        </Link>
      </p>
    </Layout>
  );
};

NewPlacePage.authenticate = true;

export default NewPlacePage;
