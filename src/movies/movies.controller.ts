import { Controller, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { AddMovieDTO } from 'src/interfaces/AddMovieDTO';
import { MovieService } from 'src/services/movie/movie.service';
import { AddMovieToCollectionDTO } from 'src/interfaces/AddMovieToCollectionDTO';
import { UpdateMovieDTO } from 'src/interfaces/UpdateMovieDTO';
import { GrabbedRadarrMovieDTO } from 'src/interfaces/GrabbedRadarrMovieDTO';
import { DeleteMovieDTO } from 'src/interfaces/DeleteMovieDTO';
import { async } from 'rxjs/internal/scheduler/async';
import { DownloadedRadarrMovieDTO } from 'src/interfaces/DownloadedRadarrMovieDTO';

@Controller('movies')
export class MoviesController {

    constructor(private movieService: MovieService)
    {

    }

       //https://www.themoviedb.org/talk/5aeaaf56c3a3682ddf0010de?language=en-US
    @Post()
    async addToRadarrAndCollectionRequest(@Body() addMovieDto: AddMovieDTO) {
        try {
        /* 

        curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"tmdbId": 348350, "monitored": false, "qualityProfileId": 6, "addOptions":  { "searchForMovie": false } }' \

  http://localhost:3000/movies


          curl --header "Content-Type: application/json" \
  --request GET \
  --data '{"seriesId": 9}' \
  http://pi:8989/api/episode?apikey=09f45fb9a7d04b96b0e8d75d3cf3cb10

        */
            console.log("in add movie")
        await this.movieService.addMovie(addMovieDto);
        } catch (error) {
            console.log("could not add movie to radarr and collection")
        }
    }


        // curl -X POST http:localhost:3000/movies/cron
    @Post('cron')
    async syncRadarrMoviesWithPouchMovies() {
        try {
            console.log("in cron");
            await this.movieService.syncRadarrMoviesWithPouchMovies();
        } catch (error) {
            console.log("could not execute cronjob fully");
            console.log(error);
        }
    }


    @Post('webhook/grab')
    async onGrabbedMovie(@Body() grabbedRadarrMovieDto: GrabbedRadarrMovieDTO)
    {
        // 2 possibilities: 
        // A in pouchdb because we used our app to add and grab --> update grabbed property in pouchdb
        // B not in pouchdb yet --> we manually added via web ui in radarr, push new pouchmovie with grabbed property

        try {
            await this.movieService.handleGrabbedMovie(grabbedRadarrMovieDto);
        } catch (error) {
            console.log("could not execute handlegrabbed movie");
            console.log(error);
        }

    }

    @Post('webhook/download')
    async onDownloadedMovie(@Body() downloadedRadarrMovieDto: DownloadedRadarrMovieDTO) {
        try {
            // download occurs after grabbed so only updating is needed.
            const updateMovieDto: UpdateMovieDTO = {
                downloaded: true,
                radarrId : downloadedRadarrMovieDto.movie.id,
                tmdbId: downloadedRadarrMovieDto.remoteMovie.tmdbId
            }
            await this.movieService.updateMovie(updateMovieDto);
            
        } catch (error) {
            console.log("could not update downloaded movie");
            console.log(error);
        }

    }




     // * curl -X DELETE -G 'http://localhost:3000/movies/9'  //
    @Delete()
    async deleteFromRadarrAndCollection(@Body() deleteMovieDto: DeleteMovieDTO)
    {
        try {
            await this.movieService.deleteMovieFromRadarrAndPouch(deleteMovieDto);
        } catch (error) {
            console.log("could not delete " + error);
        }

    }


/*
 curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"downloaded": true, "radarrId": 76, "tmdbId": 348350 }' \
  'http://localhost:3000/movies'

*/

/*
 curl --header "Content-Type: application/json" \
  --request PUT \
  --data '{"monitored": true, "radarrId": 76, "tmdbId": 348350 }' \
  'http://localhost:3000/movies'

*/

    @Put()
    async updateInRadarrAndCollection(@Body() updateMovieDto: UpdateMovieDTO)
    {
        try {
            await this.movieService.updateMovie(updateMovieDto);
        } catch (error) {
            console.log("could not update " + error);
        }
    }




}
