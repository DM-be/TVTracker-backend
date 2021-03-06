import { PouchDataLayer } from './../../patterns/datalayers/PouchDataLayer';
import { RadarrMovie } from 'src/interfaces/radarr/RadarrMovie';

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PouchService } from '../pouch/pouch.service';
import { RadarrService } from '../radarr/radarr.service';
import { AddMovieDTO } from 'src/interfaces/AddMovieDTO';
import { PouchMovie } from 'src/interfaces/PouchMovie';
import { AddMovieToCollectionDTO } from 'src/interfaces/AddMovieToCollectionDTO';
import { UpdateMovieDTO } from 'src/interfaces/radarr/UpdateMovieDTO';
import { PouchMovieDTO } from 'src/interfaces/PouchMovieDTO';
import { DeleteMovieDTO } from 'src/interfaces/DeleteMovieDTO';
import { GrabbedRadarrMovieDTO } from 'src/interfaces/radarr/GrabbedRadarrMovieDTO';
import { DataLayer } from 'src/patterns/datalayers/DataLayer';

@Injectable()
export class MovieService {


    private dataLayer: DataLayer;


    constructor(private radarrService: RadarrService)
    {
        this.dataLayer = new PouchDataLayer();
    }

    public async addMovie(addMovieDto: AddMovieDTO) {

        try {

            const radarrMovie = await this.radarrService.lookupMovie(addMovieDto.tmdbId);
            const radarrId = await this.radarrService.addMovie(radarrMovie);
            radarrMovie.id = radarrId;
            } catch (error) {
                console.log("could not add movie to radarr and collection")
            }
            
    }

    //todo: delete or still needed? --> still need though?
    public async addMovieOnlyToCollection(addMovieToCollectionDto: AddMovieToCollectionDTO) {
        try {
            const radarrMovie= await this.radarrService.lookupMovie(addMovieToCollectionDto.tmdbId); // lookup because we need poster/banner remotely 
            radarrMovie.id = addMovieToCollectionDto.radarrId;
        //    await this.pouchService.addPouchMovieToCollection(new PouchMovie(radarrMovie));

        } catch (error) {
            console.log("could not add movie only to collection");
        }
    }

    public async addGrabbedMovieToCollection(grabbedMovieDto: GrabbedRadarrMovieDTO)
    {
        try {
            const radarrMovie = await this.radarrService.lookupMovie(grabbedMovieDto.remoteMovie.tmdbId);
            radarrMovie.id = grabbedMovieDto.movie.id;
            let pouchMovie = new PouchMovie(radarrMovie);
            pouchMovie.grabbed = true;
        //    await this.pouchService.addPouchMovieToCollection(pouchMovie);
        } catch (error) {
            console.log("could not add grabbed movie to collection");
        }
    }


    // public async handleGrabbedMovie(grabbedMovieDto: GrabbedRadarrMovieDTO) {
    //     try {
    //     //    const pouchMovieExists = await this.pouchService.getPouchMovieInCollection(grabbedMovieDto.remoteMovie.tmdbId);
    //         if(pouchMovieExists)
    //         {
    //             const updateMovieDto: UpdateMovieDTO = {
    //                 grabbed: true,
    //                 radarrId: grabbedMovieDto.movie.id,
    //                 tmdbId: grabbedMovieDto.remoteMovie.tmdbId
    //             }
    //          //   await this.updateMovie(updateMovieDto);
    //         }
    //         else {
    //             const addMovieToCollectionDto: AddMovieToCollectionDTO = {
    //                 radarrId: grabbedMovieDto.movie.id,
    //                 tmdbId: grabbedMovieDto.remoteMovie.tmdbId
    //             }
    //             await this.addMovieOnlyToCollection(addMovieToCollectionDto);
    //         }
    //     } catch (error) {
    //         console.log("could not handle grabbed movie");
    //         console.log(error);
            
    //     }
    // }


    public async lookupAndAddGrabbedMovieOnlyToCollection() {


    }

    // public async syncRadarrMoviesWithPouchMovies():Promise<void> {
    //     try {
    //         const radarrMovieDtos = await this.radarrService.getMoviesFromRadarrDatabase();
    //  //       const pouchMovieDtos = await this.pouchService.getAllPouchMovieDtosInCollection();
    //         const addedRadarrMovies = await this.getAddedMoviesNotYetAddedInPouch(radarrMovieDtos, pouchMovieDtos);
    //         const deletedRadarrMovies = await this.getDeletedMoviesNotYetDeletedInPouch(radarrMovieDtos,pouchMovieDtos);
    //         addedRadarrMovies.forEach(async (radarrMovieDto: RadarrMovie) => {
    //             const addMovieToCollectionDto: AddMovieToCollectionDTO = {
    //                 radarrId: radarrMovieDto.id,
    //                 tmdbId: radarrMovieDto.tmdbId
    //             };
    //             await this.addMovieOnlyToCollection(addMovieToCollectionDto)
    //         });

    //         deletedRadarrMovies.forEach(async (pouchMovieDto: PouchMovieDTO) => {
    //             await this.pouchService.deletePouchMovieFromCollection(pouchMovieDto.tmdbId);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }

    // }

    private getAddedMoviesNotYetAddedInPouch(radarrMovieDtos: RadarrMovie [], pouchMovieDtos: PouchMovieDTO []): RadarrMovie [] {
        return radarrMovieDtos.filter(({ tmdbId: id1 }) => !pouchMovieDtos.some(({ tmdbId: id2 }) => id2 === id1));
       
    }

    private getDeletedMoviesNotYetDeletedInPouch(radarrMovieDtos: RadarrMovie [], pouchMovieDtos: PouchMovieDTO []): PouchMovieDTO [] {
        return pouchMovieDtos.filter(({ tmdbId: id1 }) => !radarrMovieDtos.some(({ tmdbId: id2 }) => id2 === id1));

    }


    public async deleteMovieFromRadarrAndPouch(deleteMovieDto: DeleteMovieDTO) {
        try {
            await this.radarrService.deleteMovie(deleteMovieDto.radarrId);
        //    await this.pouchService.deletePouchMovieFromCollection(deleteMovieDto.tmdbId);
        } catch (error) {
            console.log("could not delete movie");
        }
 
    } 


    // //todo: refactor into separate functions
    // public async updateMovie(updateMovieDto: UpdateMovieDTO) {
    //     try {
    //         if(updateMovieDto.downloaded !== undefined)
    //         {
    //             const pouchMovie = await this.pouchService.getPouchMovieInCollection(updateMovieDto.tmdbId);
    //             pouchMovie.downloaded = updateMovieDto.downloaded;
    //             await this.pouchService.updatePouchMovieInCollection(pouchMovie);
    //             // only update pouch is needed --> radarr is already up to date on this status
    //         }
    //         if(updateMovieDto.monitored !== undefined)
    //         {
    //             const radarrMovie = await this.radarrService.getMovie(updateMovieDto.radarrId);
    //             radarrMovie.monitored = updateMovieDto.monitored;
    //             const updatedRadarrMovie = await this.radarrService.updateMovie(radarrMovie);
    //             await this.pouchService.updatePouchMovieInCollection(new PouchMovie(updatedRadarrMovie));
    //             //update pouch and send monitor true or false to radarr
    //         }
    //         if(updateMovieDto.grabbed !== undefined)
    //         {
    //             let pouchMovie = await this.pouchService.getPouchMovieInCollection(updateMovieDto.tmdbId);
    //             pouchMovie.grabbed = updateMovieDto.grabbed;
    //             await this.pouchService.updatePouchMovieInCollection(pouchMovie);
    //         }
            
    //     }
    //     catch (error)
    //     {
    //         console.log("error in updating movie" + error)
    //     }

    // }

}
