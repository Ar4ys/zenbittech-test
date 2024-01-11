import { Button } from '@/components';
import { FormCheckbox } from '@/components/form-checkbox';
import { FormField } from '@/components/form-field';
import { useSignInForm } from '@/modules';
import { useSignIn } from '@/modules/auth/quries';

import { NextPageWithLayout } from './_app';

const SignInPage: NextPageWithLayout = () => {
  const { control, handleSubmit } = useSignInForm();
  const { mutate: signIn } = useSignIn();

  const onSubmit = handleSubmit((values) => {
    signIn({ body: values });
  });

  return (
    <div className="w-full px-6">
      <h1 className="text-h2 mb-10 text-center">Sign in</h1>
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
        />
        <FormCheckbox control={control} name="remember" label="Remember me" />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

SignInPage.Layout = ({ children }) => {
  return <div className="flex h-full w-full flex-col justify-center">{children}</div>;
};

SignInPage.Layout.displayName = 'SignInPage.Layout';

export default SignInPage;
