import { GetServerSideProps } from 'next';
import Link from 'next/link';

import { Button } from '@/components';
import { FormCheckbox } from '@/components/form-checkbox';
import { FormField } from '@/components/form-field';
import { useSignUp, useSignUpForm } from '@/modules/auth';
import { getSession } from '@/utils';

import { NextPageWithLayout } from './_app';

const SignUpPage: NextPageWithLayout = () => {
  const { control, handleSubmit } = useSignUpForm();
  const { mutate: signUp, isPending } = useSignUp();

  const onSubmit = handleSubmit((values) => {
    signUp({ body: values });
  });

  return (
    <div className="w-full px-6">
      <h1 className="mb-10 text-center text-h2">Sign up</h1>
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
          Sign up
        </Button>
        <Link href="/sign-in">Login</Link>
      </form>
    </div>
  );
};

SignUpPage.Layout = ({ children }) => {
  return <div className="flex min-h-full w-full grow flex-col justify-center">{children}</div>;
};

SignUpPage.Layout.displayName = 'SignUpPage.Layout';

export default SignUpPage;

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
