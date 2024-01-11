import {
  Controller,
  ParseFilePipeBuilder,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TsRest, TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { Err, Ok } from 'ts-results';

import { HttpStatus } from '@repo/shared/constants';
import { contract } from '@repo/shared/contracts';
import { MovieNotFoundError, UserIsNotAnEventOwnerError } from '@repo/shared/errors';
import { toTsRestResponse } from '@repo/shared/utils';

import { AuthGuard } from '../auth/auth.guard';
import { User } from '../auth/decorators';
import { UserJwtPayloadDto } from '../auth/dtos';
import { ImageService, UPLOAD_IMAGE_PATH, UPLOAD_PATH } from '../image';
import { MovieService } from './movie.service';

const movieFilePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({ fileType: /(^image)(\/)[a-zA-Z0-9_]*/ })
  .addMaxSizeValidator({ maxSize: 10 * 1000 * 1000 }); // 10Mb;

@TsRest({ validateResponses: true })
@Controller()
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly imageService: ImageService,
  ) {}

  @TsRestHandler(contract.movie.getPaginated)
  @UseGuards(AuthGuard)
  getPaginatedMovie(@User() user: UserJwtPayloadDto) {
    return tsRestHandler(contract.movie.getPaginated, async ({ query }) => {
      const { movieList, totalPages } = await this.movieService.findPaginatedByUserId(
        user.userId,
        query.page,
      );

      return toTsRestResponse(
        Ok({
          totalPages,
          currentPage: query.page,
          movies: movieList,
        }),
        HttpStatus.OK,
      );
    });
  }

  @TsRestHandler(contract.movie.create)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', { dest: UPLOAD_IMAGE_PATH }))
  postCreateMovie(
    @User() user: UserJwtPayloadDto,
    @UploadedFile(movieFilePipe.build())
    imageFile: Express.Multer.File,
  ) {
    return tsRestHandler(contract.movie.create, async ({ body }) => {
      const image = await this.imageService.createImage(imageFile);
      const movie = await this.movieService.createMovie({
        ...body,
        imageId: image.id,
        ownerId: user.userId,
      });

      return toTsRestResponse(Ok({ ...movie, image }), HttpStatus.CREATED);
    });
  }

  @TsRestHandler(contract.movie.update)
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image', { dest: UPLOAD_IMAGE_PATH }))
  patchUpdateMovie(
    @User() user: UserJwtPayloadDto,
    @UploadedFile(movieFilePipe.build({ fileIsRequired: false }))
    imageFile?: Express.Multer.File,
  ) {
    return tsRestHandler(contract.movie.update, async ({ params, body }) => {
      const movie = await this.movieService.findById(params.id);

      if (!movie) return toTsRestResponse(Err(new MovieNotFoundError(params.id)));
      if (movie.ownerId !== user.userId)
        toTsRestResponse(Err(new UserIsNotAnEventOwnerError(user.userId, params.id)));

      const image = imageFile ? await this.imageService.createImage(imageFile) : undefined;

      await this.movieService.updateMovie(params.id, {
        ...body,
        ...(image && { imageId: image.id }),
      });

      const result = await this.movieService.findMovieWithImage(params.id);

      return toTsRestResponse(Ok(result!), HttpStatus.OK);
    });
  }

  @TsRestHandler(contract.movie.delete)
  @UseGuards(AuthGuard)
  deleteMovie(@User() user: UserJwtPayloadDto) {
    return tsRestHandler(contract.movie.delete, async ({ params }) => {
      const movie = await this.movieService.findById(params.id);

      if (!movie) return toTsRestResponse(Err(new MovieNotFoundError(params.id)));
      if (movie.ownerId !== user.userId)
        toTsRestResponse(Err(new UserIsNotAnEventOwnerError(user.userId, params.id)));

      await this.movieService.deleteMovie(movie.id);

      return toTsRestResponse(Ok({ success: true }), HttpStatus.OK);
    });
  }
}
