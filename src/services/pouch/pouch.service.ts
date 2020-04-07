import {
    Injectable
} from '@nestjs/common';
import * as PouchDB from 'pouchdb-node';
import { RadarrMovieDTO } from 'src/interfaces/RadarrMovieDTO';
import { PouchMovie } from 'src/interfaces/PouchMovie';
import { RadarrService } from '../radarr/radarr.service';
import { AddMovieDTO } from 'src/interfaces/AddMovieDTO';
import { MovieService } from '../movie/movie.service';
import { PouchMovieDTO } from 'src/interfaces/PouchMovieDTO';
import { TvshowService } from '../tvshow/tvshow.service';
import { AddTvShowDTO } from 'src/interfaces/AddTvShowDTO';
import { SonarrService } from '../sonarr/sonarr.service';
import { SonarrTvShowDTO } from 'src/interfaces/SonarrTvShowDTO';
import { SonarrEpisode } from 'src/interfaces/SonarrEpisode';
import { PouchTvShow } from 'src/interfaces/PouchTvShow';

@Injectable()
export class PouchService {

    private movieCollection: PouchDB;
    private bufferedMovieCollection: PouchDB;
    private tvShowCollection: PouchDB;
    private bufferedTvShowCollection: PouchDB;

    private BACKEND_URL = "http://192.168.0.186:5984";
    private POUCH_OPTIONS_LIVE_RETRY = {live: true, retry: true};

    constructor(private radarrService: RadarrService, private movieService: MovieService, private tvShowService: TvshowService, private sonarrService: SonarrService) {
        this.setupMovieCollection();
        this.setupBufferedMovieCollection();
        this.setupTvShowCollection();
        this.setupBufferedTvShowCollection();
        this.initialize();
    }

    private setupTvShowCollection()
    {
        this.tvShowCollection = new PouchDB('tvShowCollection');
        this.tvShowCollection.sync(`${this.BACKEND_URL}/tvShows`, this.POUCH_OPTIONS_LIVE_RETRY)
    }

    private setupBufferedTvShowCollection() {
        this.bufferedTvShowCollection = new PouchDB('bufferedTvShowCollection');
        this.bufferedTvShowCollection.replicate.from(`${this.BACKEND_URL}/bufferedTvShows`, this.POUCH_OPTIONS_LIVE_RETRY).on('change', info => this.handleBufferedTvShowsChanges(info.docs as AddTvShowDTO []));
        this.bufferedTvShowCollection.replicate.to(`${this.BACKEND_URL}/bufferedTvShows`, this.POUCH_OPTIONS_LIVE_RETRY);
    }

    private setupMovieCollection() {
        this.movieCollection = new PouchDB('movieCollection');
        // from and to? think only to needed. 
        this.movieCollection.sync(`${this.BACKEND_URL}/movies`, this.POUCH_OPTIONS_LIVE_RETRY);
    }

    private setupBufferedMovieCollection() {
        this.bufferedMovieCollection = new PouchDB('bufferedMovieCollection');
        this.bufferedMovieCollection.replicate.from(`${this.BACKEND_URL}/bufferedMovies`, this.POUCH_OPTIONS_LIVE_RETRY).on('change', info => this.handleBufferedMoviesChanges(info.docs as AddMovieDTO []));
        // check this syncing for unnecessary calls etc
        this.bufferedMovieCollection.replicate.to(`${this.BACKEND_URL}/bufferedMovies`, this.POUCH_OPTIONS_LIVE_RETRY);
        
    }

    private async handleBufferedTvShowsChanges(addTvShowDtos: AddTvShowDTO []) {

        for (let i = 0; i < addTvShowDtos.length; i++) {
            if(addTvShowDtos[i]._deleted)
            {
                return;
            }
            try {
                await this.tvShowService.addTvShow(addTvShowDtos[i]);
                const doc = await this.bufferedTvShowCollection.get(addTvShowDtos[i]._id);
                await this.bufferedTvShowCollection.remove(doc);
            } catch (error) {
                console.log(error);
            }
            
        }
    }

    private async handleBufferedMoviesChanges(addMovieDtos: AddMovieDTO []) {
        
        for (let i = 0; i < addMovieDtos.length; i++) {
            if(addMovieDtos[i]._deleted)
            {
                return;
            }
            try {
                await this.movieService.addMovie(addMovieDtos[i]);
                const doc = await this.bufferedMovieCollection.get(addMovieDtos[i]._id);
                await this.bufferedMovieCollection.remove(doc);
            } catch (error) {
                console.log(error);
            }
            
        }
    }

    private async initialize() {
        if(await this.emptyMovieCollection()) 
        {
            await this.initializeMoviesCollection();
        }
        if(await this.emptyTvShowCollection())
        {
            await this.initializeTvShowCollection();
        }
    }

    

    private async emptyMovieCollection(): Promise < boolean > {
        try {
            const docs = await this.movieCollection.allDocs();
            return docs.total_rows === 0;
        } catch (error) {
            console.log(error);
        }
       
    }

    private async emptyTvShowCollection(): Promise<boolean> {
        try {
            const docs = await this.tvShowCollection.allDocs();
            return docs.total_rows === 0;
        } catch (error) {
            console.log(error);
        }

    }

    private async initializeMoviesCollection() {
        try {
            const radarrMovieDtos = await this.radarrService.getRadarrMovieDtosInRadarrCollection();
            const pouchMovies = await this.generatePouchMoviesWithImages(radarrMovieDtos);
            await this.bulkAddPouchMoviesToCollection(pouchMovies);
        } catch (error) {
            console.log(error);
        }
    }

    private async initializeTvShowCollection() {
        try {
            const sonarrTvShowDtos = await this.sonarrService.getAllSonarrTvShowsInCollection();
            const pouchTvShows = await this.generatePouchTvShowsWithImagesAndEpisodes(sonarrTvShowDtos);
            await this.bulkAddPouchTvShowsToCollection(pouchTvShows);
        } catch (error) {
            console.log(error);
        }
    }



    public async generatePouchTvShowWithImagesAndEpisodes(sonarrTvShowDto: SonarrTvShowDTO): Promise<PouchTvShow> {
        try {
                const episodes: SonarrEpisode [] = await this.sonarrService.getSonarrEpisodesFromSeries(sonarrTvShowDto.id);
                sonarrTvShowDto.seasons.forEach(season => {
                    season.episodes = [];
                    episodes.forEach(episode => {
                        if(episode.seasonNumber === season.seasonNumber)
                        {
                            season.episodes.push(episode);
                        }
                    });
                });
             return new PouchTvShow(sonarrTvShowDto);
        } catch (error) {
            console.log(error);
        }

    }

// refactor
    private async generatePouchTvShowsWithImagesAndEpisodes(sonarrTvShowDtos: SonarrTvShowDTO []): Promise<PouchTvShow []> {
        try {
            let tvShows : PouchTvShow [] = [];
            for (let i = 0; i < sonarrTvShowDtos.length; i++)
            {
                let tvShowInCollection = sonarrTvShowDtos[i]; 
                const tvShowDtoWithRemoteImages = await this.sonarrService.lookupSonarrTvShow(tvShowInCollection.tvdbId);
                const episodes: SonarrEpisode [] = await this.sonarrService.getSonarrEpisodesFromSeries(tvShowInCollection.id);
                tvShowInCollection.images = tvShowDtoWithRemoteImages.images;
                tvShowInCollection.seasons.forEach(season => {
                    season.episodes = [];
                    episodes.forEach(episode => {
                        if(episode.seasonNumber === season.seasonNumber)
                        {
                            season.episodes.push(episode);
                        }
                    });
                });
                const pouchTvShow = new PouchTvShow(tvShowInCollection);
                tvShows.push(pouchTvShow);
            }
            return tvShows;

        } catch (error) {
            console.log(error);
        }

    }

    public async generatePouchMoviesWithImages(radarrMovieDtos: RadarrMovieDTO []): Promise<PouchMovie []>
    {
        try {
            let movies: PouchMovie [] = [];
            for (let i = 0; i < radarrMovieDtos.length; i++) {
                let movieInRadarrCollection = radarrMovieDtos[i];
                const radarrMovieDtoWithRemoteImages = await this.radarrService.lookupRadarrMovie(movieInRadarrCollection.tmdbId);
                movieInRadarrCollection.images = radarrMovieDtoWithRemoteImages.images;
                let pouchMovie = new PouchMovie(movieInRadarrCollection);
                movies.push(pouchMovie);
            }
            return movies;
        } catch (error) {
            console.log(error);
        }
    }

    public async addPouchMovieToCollection(pouchMovie: PouchMovie)
    {
      try {
      await this.movieCollection.put(pouchMovie);
      } catch (error) {
        console.log(`unable to add movie to collection: ${error}`)
      }
    }

    public async addPouchTvShowToCollection(pouchTvShow: PouchTvShow) {
        try {
            await this.tvShowCollection.put(pouchTvShow);
            } catch (error) {
              console.log(error);
        }
    }

    async updatePouchMovieInCollection(pouchMovie: PouchMovie)
    {
        try {
            const doc: PouchMovie = await this.getPouchMovieInCollection(pouchMovie.tmdbId);
            pouchMovie._rev = doc._rev;
            await this.addPouchMovieToCollection(pouchMovie);
            
        } catch (error) {
            console.log("unable to update movie in collection " + error);
        }
    }

    async getPouchMovieInCollection(tmdbId: number): Promise<PouchMovie>
    {
        try {
            return await this.movieCollection.get(tmdbId.toString());
            } catch (error) {
              console.log(`unable to get movie from collection: ${error}`)
            }
    } 

    async pouchMovieExists(tmdbId: number): Promise<boolean> {
        try {
            const doc = await this.movieCollection.get(tmdbId.toString());
            return true;
        } catch (error) {
            return false;
        }
    }

    async deletePouchMovieFromCollection(tmdbId: number)
    {
        try {
        const doc = await this.movieCollection.get(tmdbId.toString());
        await this.movieCollection.remove(doc);
        } catch (error) {
            console.log("error delete")
        }
    }

    async bulkAddPouchMoviesToCollection(pouchMovies: PouchMovie []): Promise<void>
    {
      try {
        if(pouchMovies)
        {
            await this.movieCollection.bulkDocs(pouchMovies);
        }
        
      } catch (error) {
        console.log(`unable to bulk add movies to collection: ${error}`)
      }
    }

    async bulkAddPouchTvShowsToCollection(pouchTvShows: PouchTvShow []): Promise<void> {
        try {
            await this.tvShowCollection.bulkDocs(pouchTvShows);

        } catch (error) {
            console.log(error);
        }
    }

    async getAllPouchMovieDtosInCollection(): Promise<PouchMovieDTO []> {
        try {
            const pouchMovieDtos: PouchMovieDTO [] = [];
            const res = await this.movieCollection.allDocs({include_docs: true});
            res.rows.forEach((doc: any) => {
                pouchMovieDtos.push(doc.doc as PouchMovieDTO);
            });
            return pouchMovieDtos;
        } catch (error) {
            console.log('could not get all pouch movie dtos');
            console.log(error);
            
        }
    }




}