import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getPlace from "app/places/queries/getPlace";
import updatePlace from "app/places/mutations/updatePlace";
import { PlaceForm, FORM_ERROR } from "app/places/components/PlaceForm";

export const EditPlace = () => {
  const router = useRouter();
  const placeId = useParam("placeId", "number");
  const [place, { setQueryData }] = useQuery(
    getPlace,
    { id: placeId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    },
  );
  const [updatePlaceMutation] = useMutation(updatePlace);

  return (
    <>
      <Head>
        <title>Edit Place {place.id}</title>
      </Head>

      <div>
        <h1>Edit Place {place.id}</h1>
        <pre>{JSON.stringify(place, null, 2)}</pre>

        <PlaceForm
          submitText="Update Place"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdatePlace}
          initialValues={place}
          onSubmit={async (values) => {
            try {
              const updated = await updatePlaceMutation({
                id: place.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(Routes.ShowPlacePage({ placeId: updated.id }));
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

const EditPlacePage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPlace />
      </Suspense>

      <p>
        <Link href={Routes.PlacesPage()}>
          <a>Places</a>
        </Link>
      </p>
    </div>
  );
};

EditPlacePage.authenticate = true;
EditPlacePage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditPlacePage;
