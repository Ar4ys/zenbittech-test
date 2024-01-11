import { GetServerSideProps } from 'next';
import { useController } from 'react-hook-form';

import { Button } from '@/components';
import { FormError } from '@/components/form-error';
import { FormField } from '@/components/form-field';
import { MovieImagePicker } from '@/components/movie-image-picker';
import { PageWrapper } from '@/components/page-wrapper';
import { useIsMobile } from '@/hooks';
import { useCreateMovie, useCreateMovieForm } from '@/modules/movies';
import { getSession } from '@/utils';

import { NextPageWithLayout } from '../_app';

const CreateMoviePage: NextPageWithLayout = () => {
  const isMobile = useIsMobile();
  const { control, handleSubmit } = useCreateMovieForm();
  const { mutate: createMovie, isPending } = useCreateMovie();

  const { field: imageField, fieldState: imageFieldState } = useController({
    control,
    name: 'image',
  });

  const onSubmit = handleSubmit((values) => {
    createMovie({ body: values });
  });

  const handleImagePicker = (file: File) => {
    imageField.onBlur();
    imageField.onChange(file);
  };

  const mobileView = (
    <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={onSubmit}>
      <FormField control={control} name="title" placeholder="Title" />
      <FormField control={control} name="publishingYear" placeholder="Publishing year" />
      <div>
        <MovieImagePicker onUpload={handleImagePicker} />
        <FormError
          errorText={
            imageFieldState.isTouched &&
            (imageFieldState.error?.message ?? imageFieldState.error?.type)
          }
        />
      </div>
      <div className="flex gap-4">
        <Button type="button" variant="secondary" className="w-full">
          Cancel
        </Button>
        <Button type="submit" className="w-full" loading={isPending}>
          Submit
        </Button>
      </div>
    </form>
  );

  const desktopView = (
    <form className="grid grid-cols-2 gap-6 md:grid-cols-2" onSubmit={onSubmit}>
      <div className="grow">
        <MovieImagePicker onUpload={handleImagePicker} />
        <FormError
          errorText={
            imageFieldState.isTouched &&
            (imageFieldState.error?.message ?? imageFieldState.error?.type)
          }
        />
      </div>
      <div className="flex flex-col">
        <FormField control={control} name="title" placeholder="Title" />
        <div className="pt-6" />
        <FormField control={control} name="publishingYear" placeholder="Publishing year" />
        <div className="pt-16" />
        <div className="flex gap-4">
          <Button type="button" variant="secondary" className="w-full">
            Cancel
          </Button>
          <Button type="submit" className="w-full" loading={isPending}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );

  return isMobile ? mobileView : desktopView;
};

CreateMoviePage.Layout = ({ children }) => {
  return (
    <PageWrapper left={<h1 className="text-h2">Create a new movie</h1>}>{children}</PageWrapper>
  );
};

CreateMoviePage.Layout.displayName = 'CreateMoviePage.Layout';

export default CreateMoviePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return { redirect: { destination: '/sign-in', permanent: false } };
  }

  return {
    props: {
      sessionUserId: session.userId,
    },
  };
};
