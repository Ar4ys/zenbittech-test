import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';

import { Button } from '@/components';
import { Loader } from '@/components/loader';
import { PageWrapper } from '@/components/page-wrapper';
import { Pager } from '@/components/pager';
import { AddCircleIcon, LogoutIcon } from '@/icons';
import { useSignOut } from '@/modules/auth';
import { getPaginatedMovies, moviesQueryKeys, useGetPaginatedMovies } from '@/modules/movies';
import { getSession } from '@/utils';

import { NextPageWithLayout } from '../_app';

const MoviesPage: NextPageWithLayout = () => {
  const [page, setPage] = useState(0);
  const { data } = useGetPaginatedMovies(page);

  const movies = data?.body.movies ?? [];
  const totalPages = data?.body.totalPages ?? 0;

  return (
    <>
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
      <Pager currentPage={page} totalPages={totalPages} onPage={(page) => setPage(page)} />
    </>
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

  const redirectToCreateMovie = () => {
    router.push('/movies/create');
  };

  const withCenteredLayout = (children: ReactNode) => (
    <div className="flex h-full w-full grow flex-col justify-center px-6">{children}</div>
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
      <div className="flex w-full flex-col items-center gap-10">
        <h1 className="text-h3 text-center">Your movie list is empty</h1>
        <Button className="w-full md:w-fit" onClick={redirectToCreateMovie}>
          Add a new movie
        </Button>
      </div>,
    );
  else
    return (
      <PageWrapper
        left={
          <div className="flex items-center gap-3">
            <h1 className="text-h3">My movies</h1>
            <Button variant="clear" onClick={redirectToCreateMovie}>
              <AddCircleIcon width={24} height={24} />
            </Button>
          </div>
        }
        right={
          <Button
            variant="clear"
            loading={isSignOutLoading}
            onClick={() => signOut({})}
            className="flex items-center gap-3"
          >
            <span className="text-body-regular hidden md:inline">Logout</span>
            <LogoutIcon />
          </Button>
        }
      >
        {children}
      </PageWrapper>
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
