import { AddMovieCommand } from './../command/AddMovieCommand';
import { RadarrService } from './../../services/radarr/radarr.service';
import { DataLayer } from "./DataLayer";
import * as PouchDB from 'pouchdb-node';
import { RadarrMovie } from 'src/interfaces/radarr/RadarrMovie';


export class PouchDataLayer extends DataLayer {
    async addMovies(radarrMovies: RadarrMovie[]): Promise<void> {
        try {
            await this.movieCollection.bulkDocs(radarrMovies);
        } catch (error) {
            console.log(error);
        }
    }



    private movieCollection: PouchDB;

    private BACKEND_URL = "http://192.168.10.186:5984";
    private POUCH_OPTIONS_LIVE_RETRY = {live: true, retry: true};


    async initializeMovieCollection(): Promise<void> {
        this.movieCollection = new PouchDB('movieCollection');
        if(await this.emptyMovieCollection())
        {
            console.log("its empty")
           await this.addMoviesFromRadarrDatabaseToMovieCollection();
        }
        this.movieCollection.sync(`${this.BACKEND_URL}/movies`, this.POUCH_OPTIONS_LIVE_RETRY).on('change', info => this.handleRemoteMovieChanges(info));
    }



    async addMoviesFromRadarrDatabaseToMovieCollection() {
        try {
            const radarrService = new RadarrService();
            const movies = await radarrService.getMoviesFromRadarrDatabase();
            await this.addMovies(movies);
        } catch (error) {
            console.log(error);
        }
    
    }

    initializeTvShowCollection(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addMovie(radarrMovie: import("../../interfaces/radarr/RadarrMovie").RadarrMovie): Promise<void> {
        throw new Error("Method not implemented.");
    }
    removeMovie(tmdbId: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async updateMovie(radarrMovie: RadarrMovie): Promise<void> {
        const doc: RadarrMovie = await this.movieCollection.get(radarrMovie.tmdbId.toString());
        radarrMovie._rev = doc._rev;
        await this.movieCollection.put(radarrMovie);
    }
    getMovie(tmdbId: number): import("../../interfaces/radarr/RadarrMovie").RadarrMovie {
        throw new Error("Method not implemented.");
    }



    private async emptyMovieCollection(): Promise < boolean > {
        try {
            const docs = await this.movieCollection.allDocs();
            return docs.total_rows === 0;
        } catch (error) {
            console.log(error);
        }
       
    }

    private async handleRemoteMovieChanges(info: any): Promise<void> {
        
        console.log(info);
        if(info.change.docs)
        {
            console.log(info.change.docs);
            const changedDocsFromRemote = info.change.docs as RadarrMovie [];
            changedDocsFromRemote.forEach( async(radarrMovie: RadarrMovie) => {
                if(radarrMovie._deleted) 
                {
                    return;
                }
                if(radarrMovie.addOptions)
                {
                    const addMovieCommand = new AddMovieCommand(new RadarrService(), this, radarrMovie);
                    return await addMovieCommand.execute();
                }
                // do nothing, its an added movie
              
            })
        }
        }
}
