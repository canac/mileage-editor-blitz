import { Suspense } from "react";
import Head from "next/head";
import { useMutation, usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getPlaces from "app/places/queries/getPlaces";
import createPlace from "app/places/mutations/createPlace";
import { Button, Title } from "@mantine/core";
import { PlaceForm } from "app/places/components/PlaceForm";

const ITEMS_PER_PAGE = 100;

export const PlacesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ places, hasMore }, { refetch }] = usePaginatedQuery(getPlaces, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const [createPlaceMutation] = useMutation(createPlace);

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  async function addPlace() {
    await createPlaceMutation({
      name: "",
      address: "",
    });
    await refetch();
  }

  return (
    <div>
      <Title order={1} style={{ textAlign: "center", marginBottom: "1em" }}>
        Places
      </Title>

      {places.map((place) => (
        <PlaceForm
          key={place.id}
          place={place}
          onDelete={() => refetch()}
          style={{ marginBottom: "1em" }}
        />
      ))}

      <div style={{ marginBottom: "1em" }}>
        <Button
          variant="filled"
          color="green"
          onClick={() => addPlace()}
          style={{ alignSelf: "flex-end" }}
        >
          Create new place
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

const PlacesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Places</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <PlacesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default PlacesPage;
