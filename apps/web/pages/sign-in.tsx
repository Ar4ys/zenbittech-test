import { GetServerSideProps } from 'next';
import Link from 'next/link';

import { Button } from '@/components';
import { FormCheckbox } from '@/components/form-checkbox';
import { FormField } from '@/components/form-field';
import { useSignIn, useSignInForm } from '@/modules/auth';
import { getSession } from '@/utils';

import { NextPageWithLayout } from './_app';

const SignInPage: NextPageWithLayout = () => {
  const { control, handleSubmit } = useSignInForm();
  const { mutate: signIn, isPending } = useSignIn();

  const onSubmit = handleSubmit((values) => {
    signIn({ body: values });
  });

  return (
    <div className="w-full px-6">
      <h1 className="mb-10 text-center text-h2">Sign in</h1>
      <form className="flex w-full flex-col items-center gap-6" onSubmit={onSubmit}>
        <FormField
          control={control}
          name="email"
          placeholder="Email"
          autoComplete="email"
          inputMode="email"
        />
        <FormField
          control={control}
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          type="password"
        />
        <FormCheckbox control={control} name="remember" label="Remember me" />
        <Button type="submit" className="w-full" loading={isPending}>
          Login
        </Button>
        <Link href="/sign-up">Sign up</Link>
      </form>
    </div>
  );
};

SignInPage.Layout = ({ children }) => {
  return <div className="flex min-h-full w-full grow flex-col justify-center">{children}</div>;
};

SignInPage.Layout.displayName = 'SignInPage.Layout';

export default SignInPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (session) {
    return { redirect: { destination: '/movies', permanent: false } };
  }

  return {
    props: {
      sessionUserId: null,
    },
  };
};
