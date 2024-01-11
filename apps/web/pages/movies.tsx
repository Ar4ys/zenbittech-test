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
  return <div className=""></div>;
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
      <div className="flex h-full w-full flex-col px-6 pt-20">
        <div className="flex justify-between">
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
