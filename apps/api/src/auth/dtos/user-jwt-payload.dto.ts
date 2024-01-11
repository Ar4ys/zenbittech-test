import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const userJwtPayloadSchema = z.object({
  userId: z.number(),
});

export class UserJwtPayloadDto extends createZodDto(userJwtPayloadSchema) {}
