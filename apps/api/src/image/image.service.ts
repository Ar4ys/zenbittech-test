import * as fs from 'fs/promises';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as blurhash from 'blurhash';
import sharp from 'sharp';

import { AppDb, Image, images } from '@/db';
import { Environment } from '@/environment';

import { DbService } from '../db';
import { UPLOAD_IMAGE_ROUTE_PREFIX } from './constants';

@Injectable()
export class ImageService {
  private db: AppDb;
  private FRONTEND_URL: string;
  private logger = new Logger('ImageService');

  constructor(
    private dbService: DbService,
    private configService: ConfigService<Environment, true>,
  ) {
    this.db = this.dbService.db;
    this.FRONTEND_URL = this.configService.get('FRONTEND_URL', { infer: true });
  }

  async createImage(file: Express.Multer.File): Promise<Image> {
    const newFilePath = file.path + '.jpg';
    await sharp(file.path).jpeg({ quality: 80 }).toFile(newFilePath);

    fs.rm(file.path).catch((error: Error) =>
      this.logger.error(
        `Unable to delete file in ImageService.createImage: ${error.message}`,
        error.stack,
      ),
    );

    const blurhashString = await this.encodeImageToBlurhash(newFilePath);

    const [image] = await this.db
      .insert(images)
      .values({
        url: `${this.FRONTEND_URL}/${UPLOAD_IMAGE_ROUTE_PREFIX}/${file.filename}.jpg`,
        blurhash: blurhashString,
      })
      .returning();

    return image;
  }

  private async encodeImageToBlurhash(path: string): Promise<string> {
    const { data, info } = await sharp(path)
      .raw()
      .ensureAlpha()
      .resize(32, 32, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true });

    return blurhash.encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4);
  }
}
