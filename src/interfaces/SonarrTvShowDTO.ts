
import { SonarrSeason } from "./SonarrSeason";
import { Image } from "./Image";

export interface SonarrTvShowDTO {
    title: string;
    sortTitle;
    seasonCount: number;
    episodeCount: number;
    episodeFileCount: number;
    status: string;
    overview: string;
    previousAiring: string;
    network: string;
    images: Image [];
    seasons: SonarrSeason [];
    year: number;
    path: string; 
    profiledId: number;
    monitored: boolean;
    runTime: number;
    tvdbId: number;
    firstAired: string; 
    imdbId: string;
    titleSlug: string;
    genres: string [];
    added: string;
    ratings: {
        votes: number;
        value: number;
    };
    qualityProfileId: number;
    id: number; 
   


}