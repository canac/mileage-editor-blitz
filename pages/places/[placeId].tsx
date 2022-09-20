import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "app/core/layouts/Layout";
import getPlace from "app/places/queries/getPlace";
import deletePlace from "app/places/mutations/deletePlace";

export const Place = () => {
  const router = useRouter();
  const placeId = useParam("placeId", "number");
  const [deletePlaceMutation] = useMutation(deletePlace);
  const [place] = useQuery(getPlace, { id: placeId });

  return (
    <>
      <Head>
        <title>Place {place.id}</title>
      </Head>

      <div>
        <h1>Place {place.id}</h1>
        <pre>{JSON.stringify(place, null, 2)}</pre>

        <Link href={Routes.EditPlacePage({ placeId: place.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deletePlaceMutation({ id: place.id });
              await router.push(Routes.PlacesPage());
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

const ShowPlacePage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.PlacesPage()}>
          <a>Places</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Place />
      </Suspense>
    </div>
  );
};

ShowPlacePage.authenticate = true;
ShowPlacePage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowPlacePage;
