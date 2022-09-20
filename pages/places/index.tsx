import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "app/core/layouts/Layout";
import getPlaces from "app/places/queries/getPlaces";

const ITEMS_PER_PAGE = 100;

export const PlacesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ places, hasMore }] = usePaginatedQuery(getPlaces, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {places.map((place) => (
          <li key={place.id}>
            <Link href={Routes.ShowPlacePage({ placeId: place.id })}>
              <a>{place.name}</a>
            </Link>
          </li>
        ))}
      </ul>

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
        <p>
          <Link href={Routes.NewPlacePage()}>
            <a>Create Place</a>
          </Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <PlacesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default PlacesPage;
