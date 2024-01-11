import path from 'path';

export const UPLOAD_IMAGE_ROUTE_PREFIX = 'images';
export const UPLOAD_PATH = path.join(__dirname, '../..', 'uploaded-files');
export const UPLOAD_IMAGE_PATH = path.join(
  __dirname,
  '../..',
  'uploaded-files',
  UPLOAD_IMAGE_ROUTE_PREFIX,
);
