import { User } from '@/db';

export type SignInReturnData = {
  user: User;
  token: string;
};
