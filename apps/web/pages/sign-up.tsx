import Link from 'next/link';

import { Button } from '@/components';
import { FormCheckbox } from '@/components/form-checkbox';
import { FormField } from '@/components/form-field';
import { useSignUp, useSignUpForm } from '@/modules/auth';

import { NextPageWithLayout } from './_app';

const SignUpPage: NextPageWithLayout = () => {
  const { control, handleSubmit } = useSignUpForm();
  const { mutate: signUp } = useSignUp();

  const onSubmit = handleSubmit((values) => {
    signUp({ body: values });
  });

  return (
    <div className="w-full px-6">
      <h1 className="text-h2 mb-10 text-center">Sign up</h1>
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
        <Button type="submit" className="w-full">
          Sign up
        </Button>
        <Link href="/sign-in">Login</Link>
      </form>
    </div>
  );
};

SignUpPage.Layout = ({ children }) => {
  return <div className="flex h-full w-full flex-col justify-center">{children}</div>;
};

SignUpPage.Layout.displayName = 'SignUpPage.Layout';

export default SignUpPage;
