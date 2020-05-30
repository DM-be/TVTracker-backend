import { RadarrMovie } from './../../interfaces/radarr/RadarrMovie';

import { BehaviorSubject, Observable } from 'rxjs';
export abstract class DataLayer {

    private _initializedDataLayer$: BehaviorSubject<boolean>;

    abstract initializeMovieCollection(): Promise<void>;
    abstract initializeTvShowCollection(): Promise<void>;


    constructor() {
        this._initializedDataLayer$ = new BehaviorSubject<boolean>(false);
        this.initializeDatalayer();
    }

  
    get initializedDataLayer$(): BehaviorSubject<boolean> {
        return this._initializedDataLayer$;
    }


    private async initializeDatalayer(): Promise<void> {
        try {
             await this.initializeMovieCollection();
          //  this._tvShows$ = await this.initializeTvShows();
            this.emitInitializedDataLayer$();
            this.onInit();
        } catch (error) {
            console.log(error);
        }
    }
    onInit() {}

    private emitInitializedDataLayer$() {
        this._initializedDataLayer$.next(true);
    }

    abstract addMovie(radarrMovie: RadarrMovie): Promise<void>;
    abstract addMovies(radarrMovies: RadarrMovie []): Promise<void>;
    abstract removeMovie(tmdbId: number): Promise<void>;
    abstract updateMovie(radarrMovie: RadarrMovie): Promise<void>;
    abstract getMovie(tmdbId: number): RadarrMovie;
}
