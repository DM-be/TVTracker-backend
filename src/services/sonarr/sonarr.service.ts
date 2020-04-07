import { Injectable } from '@nestjs/common';
import Axios, { AxiosResponse } from 'axios';
import { SonarrTvShowDTO } from 'src/interfaces/SonarrTvShowDTO';
import { SonarrEpisode } from 'src/interfaces/SonarrEpisode';
import { AddTvShowDTO } from 'src/interfaces/AddTvShowDTO';

@Injectable()
export class SonarrService {
    private BASE_URL = "http://192.168.0.243:8989/api"
    private API_KEY = "09f45fb9a7d04b96b0e8d75d3cf3cb10";



    public async searchEpisodes(episodeIds: number []): Promise<number>{
        const fullUrl = `${this.BASE_URL}/command/?apikey=${this.API_KEY}`;
        try { 
            const axiosResponse = await Axios.post(fullUrl, {
                name: "EpisodeSearch",
                episodeIds
            });
            return axiosResponse.status;
        } catch (error) {
            console.log(error);
        }
    }

    public async searchSeason(seriesId: number, seasonNumber: number): Promise<number> {
        const fullUrl = `${this.BASE_URL}/command/?apikey=${this.API_KEY}`;
        try {
            const axiosResponse = await Axios.post(fullUrl, {
                name: "SeasonSearch",
                seriesId,
                seasonNumber
            });
            return axiosResponse.status;
        } catch (error) {
            console.log(error);
        }
    }


    public async getAllSonarrTvShowsInCollection(): Promise<SonarrTvShowDTO []> {
        const fullUrl = `${this.BASE_URL}/series/?apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const tvShowObjects = axiosResponse.data as SonarrTvShowDTO [];
            return tvShowObjects;
        } catch (error) {
            console.log(error);
        }
    }

    public async toggleMonitoredStatusForSeason(seriesId: number, seasonNumber: number):Promise<number> {
        try {
            const sonarrTvShowDto = await this.getSonarrTvShow(seriesId);
            const season = sonarrTvShowDto.seasons.find(s => s.seasonNumber === seasonNumber);
            season.monitored = !season.monitored; 
            const status = await this.updateSonarrTvShow(sonarrTvShowDto);
            return status;
        } catch (error) {
            console.log(status);
        }
    } 

    public async toggleMonitoredStatusForTvShow(seriesId: number):Promise<number> {
        try {
            const sonarrTvShowDto = await this.getSonarrTvShow(seriesId);
            sonarrTvShowDto.monitored = !sonarrTvShowDto.monitored;
            const status = await this.updateSonarrTvShow(sonarrTvShowDto);
            return status;
        } catch (error) {
            console.log(status);
        }
    } 




    public async updateSonarrTvShow(sonarrTvShowDto: SonarrTvShowDTO): Promise<number> {
        const fullUrl = `${this.BASE_URL}/series/?apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.put(fullUrl, sonarrTvShowDto);
            return axiosResponse.status;
        } catch (error) {
            console.log(error);
        }

    }

    public async getSonarrEpisodesFromSeries(seriesId: number): Promise<SonarrEpisode []> {
        const fullUrl = `${this.BASE_URL}/episode/?seriesId=${seriesId}&apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const episodes = axiosResponse.data as SonarrEpisode [];
            return episodes;
        } catch (error) {
            console.log(error);
        }
    } 

    public async lookupSonarrTvShow(tvdbId: number): Promise<SonarrTvShowDTO> {
        const fullUrl = `${this.BASE_URL}/series/lookup?term=tvdb:${tvdbId}&apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const sonarrTvShow = axiosResponse.data as SonarrTvShowDTO ;
            return sonarrTvShow;
        } catch (error) {
            console.log(error);
        }
    }

    public async getSonarrTvShow(id: number): Promise<SonarrTvShowDTO> {
        const fullUrl = `${this.BASE_URL}/series/${id}?apikey=${this.API_KEY}`;
        try {
            const axiosResponse: AxiosResponse<any> = await Axios.get(fullUrl);
            const sonarrTvShow = axiosResponse.data as SonarrTvShowDTO ;
            return sonarrTvShow;
        } catch (error) {
            console.log(error);
        }
    }



    public async addSonarrTvShow(addTvShowDto: AddTvShowDTO): Promise<number> {
        const fullUrl = `${this.BASE_URL}/series?apikey=${this.API_KEY}`;
        try {
            // only keep relevant addTvshowDto;
            //todo: rework in frontend dto etc etc
            const body: AddTvShowDTO = {
               addOptions: addTvShowDto.addOptions,
               images: addTvShowDto.images,
               path: `/data/tvshows/${addTvShowDto.title}`,
               tvdbId: addTvShowDto.tvdbId,
               qualityProfileId: addTvShowDto.qualityProfileId,
               title: addTvShowDto.title,
               titleSlug: addTvShowDto.titleSlug,
               seasons: addTvShowDto.seasons,
               seasonFolder: true
            }
            const axiosResponse = await Axios.post(fullUrl, body);
            const sonarrTvShow = axiosResponse.data as SonarrTvShowDTO ;
            return sonarrTvShow.id;

        } catch (error) {
            console.log(error);
            
        }

    }
}
