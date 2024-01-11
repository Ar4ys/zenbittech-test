import { auth } from './auth';
import { c } from './contract';
import { movie } from './movie';

export const contract = c.router(
  {
    auth,
    movie,
  },
  {
    pathPrefix: '/api',
    strictStatusCodes: true,
  },
);
