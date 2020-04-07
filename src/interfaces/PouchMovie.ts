import { RadarrMovieDTO } from "./RadarrMovieDTO";
import { Image } from "./Image";


export class PouchMovie {
    title: string;
    overview: string;
    downloaded: boolean;
    monitored: boolean;
    tmdbId: number;
    id: number;
    _id: string;
    _rev?: string;
    images: Image [];

    grabbed?: boolean; // gets set by the webhook


    constructor(movie: RadarrMovieDTO) {
        this.title = movie.title;
        this.overview = movie.overview;
        this.downloaded = movie.downloaded;
        this.monitored = movie.monitored;
        this.tmdbId = movie.tmdbId;
        this.id = movie.id;
        this._id = movie.tmdbId.toString();
        this.images = movie.images;

    }

}