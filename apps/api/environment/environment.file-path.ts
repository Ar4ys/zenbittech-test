import { NodeEnv } from './environment.enum';

export function getEnvironmentFilePath(): string[] {
  const nodeEnv = process.env.NODE_ENV ?? 'development';

  const getPathList = (mode: string) => [
    `.env.${mode}.local`,
    `.env.${mode}`,
    '.env.local',
    '.env',
  ];

  switch (nodeEnv) {
    case NodeEnv.PRODUCTION:
    case NodeEnv.STAGING:
    case NodeEnv.DEVELOPMENT:
      return getPathList(nodeEnv);
    default:
      return getPathList(NodeEnv.DEVELOPMENT);
  }
}
