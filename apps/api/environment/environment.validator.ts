import { Environment, environmentSchema } from './environment.schema';

export function environmentValidator(config: Record<string, unknown>): Environment {
  const configWithoutEmptyStrings = Object.fromEntries(
    Object.entries(config).filter((entry) => entry[1] !== ''),
  );

  const result = environmentSchema.safeParse(configWithoutEmptyStrings);

  if (!result.success) {
    const errors = JSON.stringify(result.error.format(), null, 4);
    throw new Error(`Environment validation error: ${errors}`);
  }

  return result.data;
}
