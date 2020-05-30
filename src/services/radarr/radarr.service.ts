import { RadarrMovie } from './../../interfaces/radarr/RadarrMovie';
import { Injectable } from '@nestjs/common';
import Axios, { AxiosResponse } from 'axios';
import { AddRadarrMovieDTO } from 'src/interfaces/radarr/AddRadarrMovieDTO';
import { AddOptions } from 'src/interfaces/AddOptions';


@Injectable()
export class RadarrService {
    private BASE_URL = "http://192.168.0.245:7878/api/"
    private API_KEY = "9365d415a25043ecbccad5b5c13d47ce";

    public async getMoviesFromRadarrDatabase(): Promise<RadarrMovie []> {
        try {
            const fullUrl = `${this.BASE_URL}/movie/?apikey=${this.API_KEY}`;
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const movieObjects = axiosResponse.data as RadarrMovie [];
            return movieObjects;
        } catch (error) {
            console.log(error);
        }
   
    } 

    public async getMovie(radarr_id: number): Promise<RadarrMovie> {
        const fullUrl = `${this.BASE_URL}/movie/${radarr_id}?apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const radarrMovie = axiosResponse.data as RadarrMovie ;
            return radarrMovie;
        } catch (error) {
            console.log(error);
        }
        
    }

    // AFTER lookup
    public async addMovie(radarrMovie: RadarrMovie): Promise<number>
    {
        const fullUrl = `${this.BASE_URL}/movie?apikey=${this.API_KEY}`;
        const { addOptions, qualityProfileId, images, title, tmdbId, year, monitored, titleSlug} = radarrMovie;
        const addRadarrMovieDto: AddRadarrMovieDTO = 
        {
            addOptions,
            qualityProfileId,
            monitored,
            images,
            path: `/data//movies/${radarrMovie.title} (${radarrMovie.year})`,
            title,
            titleSlug,
            tmdbId,
            year,
        };
        try {
            const axiosResponse = await Axios.post(fullUrl, addRadarrMovieDto);
            const radarrMovieWithGeneratedId = axiosResponse.data as RadarrMovie;
            return radarrMovieWithGeneratedId.id;
        } catch (error) {
            console.log(error)
        }
    
    }
    
    public async updateMovie(radarrMovieDtoWithChanges: RadarrMovie): Promise<RadarrMovie>
    {
        const fullUrl = `${this.BASE_URL}/movie?apikey=${this.API_KEY}`
        try {
            const axiosResponse = await Axios.put(fullUrl, radarrMovieDtoWithChanges);
            const updatedRadarrMovie = axiosResponse.data as RadarrMovie;
            return updatedRadarrMovie;
        } catch (error) {
            console.log("could not update radarr movie " + error);
        }
    }

    public async lookupMovie(tmdbId: number): Promise<RadarrMovie> {
        const fullUrl = `${this.BASE_URL}/movie/lookup/tmdb?tmdbId=${tmdbId}&apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const radarrMovie = axiosResponse.data as RadarrMovie ;
            return radarrMovie;
        } catch (error) {
            console.log(error);
        }
        
    }

    public async deleteMovie(radarrId: number): Promise<void> {
        const fullUrl = `${this.BASE_URL}/movie/${radarrId}?apikey=${this.API_KEY}&deleteFiles=true`;
        try {
            return await Axios.delete(fullUrl);
        } catch (error) {
            console.log("error delete");
        }
        
    }
    

}
