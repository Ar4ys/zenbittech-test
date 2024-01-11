import { User } from '@/db';

export type SignUpReturnData = {
  user: User;
  token: string;
};
