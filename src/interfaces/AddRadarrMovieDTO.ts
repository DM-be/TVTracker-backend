import { AddOptions } from "./AddOptions";
import { Image } from "./Image";


export interface AddRadarrMovieDTO {
    title: string;
    qualityProfileId?: number;
    images: Image [];
    year: number;
    tmdbId: number;
    titleSlug: string;
    path?: string; //todo: fill with env!
    monitored?: boolean
    addOptions?: AddOptions
}