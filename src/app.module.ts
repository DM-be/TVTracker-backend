import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PouchService } from './services/pouch/pouch.service';
import { RadarrService } from './services/radarr/radarr.service';
import { MoviesController } from './movies/movies.controller';
import { MovieService } from './services/movie/movie.service';
import { WebhookController } from './webhook/webhook.controller';
import { TvshowService } from './services/tvshow/tvshow.service';
import { SonarrService } from './services/sonarr/sonarr.service';

@Module({
  imports: [],
  controllers: [AppController, MoviesController, WebhookController],
  providers: [AppService, PouchService, RadarrService, MovieService, TvshowService, SonarrService],
})
export class AppModule {}
