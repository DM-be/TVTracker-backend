import { Injectable } from '@nestjs/common';
import Axios, { AxiosResponse } from 'axios';
import { RadarrMovieDTO } from 'src/interfaces/RadarrMovieDTO';
import { AddRadarrMovieDTO } from 'src/interfaces/AddRadarrMovieDTO';
import { AddOptions } from 'src/interfaces/AddOptions';


@Injectable()
export class RadarrService {
    private BACKEND_URL = "http://192.168.0.245:7878/api/movie?apikey=9365d415a25043ecbccad5b5c13d47ce"; // put apikey in env docker
    private BASE_URL = "http://192.168.0.245:7878/api/"
    private API_KEY = "9365d415a25043ecbccad5b5c13d47ce";

    public async getRadarrMovieDtosInRadarrCollection(): Promise<RadarrMovieDTO []> {
        try {
            const fullUrl = `${this.BASE_URL}/movie/?apikey=${this.API_KEY}`;
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const movieObjects = axiosResponse.data as RadarrMovieDTO [];
            return movieObjects;
        } catch (error) {
            console.log(error);
        }
   
    } 

    public async getRadarrMovie(radarr_id: number): Promise<RadarrMovieDTO> {
        const fullUrl = `${this.BASE_URL}/movie/${radarr_id}?apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const radarrMovie = axiosResponse.data as RadarrMovieDTO ;
            return radarrMovie;
        } catch (error) {
            console.log(error);
        }
        
    }

    public async addRadarrMovie(radarrMovieDto: RadarrMovieDTO, addOptions: AddOptions, qualityProfileId: number, monitored: boolean): Promise<number>
    {
        const fullUrl = `${this.BASE_URL}/movie?apikey=${this.API_KEY}`;
        const addRadarrMovieDto: AddRadarrMovieDTO = 
        {
            addOptions: addOptions,
            qualityProfileId: qualityProfileId,
            monitored: true,
            images: radarrMovieDto.images,
            path: `/data//movies/${radarrMovieDto.title} (${radarrMovieDto.year})`,
            title: radarrMovieDto.title,
            titleSlug: radarrMovieDto.titleSlug,
            tmdbId: radarrMovieDto.tmdbId,
            year: radarrMovieDto.year
        };
        try {
            const axiosResponse = await Axios.post(fullUrl, addRadarrMovieDto);
            const radarrMovieWithGeneratedId = axiosResponse.data as RadarrMovieDTO;
            return radarrMovieWithGeneratedId.id;
        } catch (error) {
            console.log(error)
        }
    
    }
    
    public async updateRadarrMovie(radarrMovieDtoWithChanges: RadarrMovieDTO): Promise<RadarrMovieDTO>
    {
        const fullUrl = `${this.BASE_URL}/movie?apikey=${this.API_KEY}`
        try {
            const axiosResponse = await Axios.put(fullUrl, radarrMovieDtoWithChanges);
            const updatedRadarrMovie = axiosResponse.data as RadarrMovieDTO;
            return updatedRadarrMovie;
        } catch (error) {
            console.log("could not update radarr movie " + error);
        }
    }

    public async lookupRadarrMovie(tmdbId: number): Promise<RadarrMovieDTO> {
        const fullUrl = `${this.BASE_URL}/movie/lookup/tmdb?tmdbId=${tmdbId}&apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const radarrMovie = axiosResponse.data as RadarrMovieDTO ;
            return radarrMovie;
        } catch (error) {
            console.log(error);
        }
        
    }

    public async deleteRadarrMovie(radarrId: number): Promise<void> {
        const fullUrl = `${this.BASE_URL}/movie/${radarrId}?apikey=${this.API_KEY}&deleteFiles=true`;
        try {
            return await Axios.delete(fullUrl);
        } catch (error) {
            console.log("error delete");
        }
        
    }
    

}
