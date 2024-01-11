import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { Button } from '@/components';
import { Loader } from '@/components/loader';
import { AddCircleIcon, LogoutIcon } from '@/icons';
import { useSignOut } from '@/modules/auth';
import { getPaginatedMovies, moviesQueryKeys, useGetPaginatedMovies } from '@/modules/movies';
import { getSession } from '@/utils';

import { NextPageWithLayout } from './_app';

const MoviesPage: NextPageWithLayout = () => {
  const { data } = useGetPaginatedMovies(0);

  const movies = data?.body.movies ?? [];

  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      {movies.map((movie) => (
        <div
          className="bg-card w-full overflow-hidden rounded-xl min-[400px]:min-w-[180px] md:max-h-[504px] md:max-w-[282px]"
          key={movie.id}
        >
          <img src={movie.image.url} className="h-[75%] w-full object-cover" />
          <div className="flex flex-col gap-4 p-3">
            <h3 className="text-body-regular">{movie.title}</h3>
            <p className="text-body-small">{movie.publishingYear}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

MoviesPage.Layout = ({ children }) => {
  // We are actually in react component
  /* eslint-disable react-hooks/rules-of-hooks */
  const { data, error, isLoading } = useGetPaginatedMovies(0);
  const { mutate: signOut, isPending: isSignOutLoading } = useSignOut();
  const router = useRouter();
  /* eslint-enable react-hooks/rules-of-hooks */

  const hasMovies = data?.body.movies.length;

  const redirectToCreateMovie = () => router.push('/movies/create');

  const withCenteredLayout = (children: ReactNode) => (
    <div className="flex h-full w-full flex-col justify-center px-6">{children}</div>
  );

  if (isLoading) return withCenteredLayout(<Loader />);
  else if (error)
    return withCenteredLayout(
      <div className="flex w-full flex-col gap-10">
        <h1 className="text-h3 text-center">Error while fetching movies</h1>
        <p className="text-body-large">{error.body.message}</p>
      </div>,
    );
  else if (!hasMovies)
    return withCenteredLayout(
      <div className="flex w-full flex-col gap-10">
        <h1 className="text-h3 text-center">Your movie list is empty</h1>
        <Button className="w-full" onClick={redirectToCreateMovie}>
          Add a new movie
        </Button>
      </div>,
    );
  else
    return (
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-center px-6">
        <div className="flex w-full justify-between py-20">
          <div className="flex gap-3">
            <h1 className="text-h3">My movies</h1>
            <Button variant="clear" onClick={redirectToCreateMovie}>
              <AddCircleIcon width={24} height={24} />
            </Button>
          </div>
          <Button variant="clear" loading={isSignOutLoading} onClick={() => signOut({})}>
            <LogoutIcon />
          </Button>
        </div>
        {children}
      </div>
    );
};

MoviesPage.Layout.displayName = 'MoviesPage.Layout';

export default MoviesPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return { redirect: { destination: '/sign-in', permanent: false } };
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: moviesQueryKeys.paginatedMovies(0).queryKey,
    queryFn: () => getPaginatedMovies(0),
  });

  return {
    props: {
      sessionUserId: session.userId,
      dehydratedState: dehydrate(queryClient),
    },
  };
};
