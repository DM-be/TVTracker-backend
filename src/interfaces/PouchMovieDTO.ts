import { Image } from "./Image";

export interface PouchMovieDTO {
    title: string;
    overview: string;
    downloaded: boolean;
    monitored: boolean;
    tmdbId: number;
    id: number;
    _id: string;
    _rev: string;
    images: Image [];
    grabbed: boolean;

}