import { SonarrTvShowDTO } from "./SonarrTvShowDTO";
import { SonarrSeason } from "./SonarrSeason";
import { Image } from "./Image";

export class PouchTvShow {
    title: string;
    seasonCount: number;
    status: string;
    overview: string;
    seasons: SonarrSeason [];
    year: number;
    tvdbId: number;
    runTime: number;
    firstAired: string;
    genres: string [];
    images: Image [];
    id: number;

    _id: string;
    _rev?: string;
    grabbed?: boolean; // gets set by webhook



    constructor(tvShow: SonarrTvShowDTO) {
        this.title = tvShow.title;
        this.seasonCount = tvShow.seasonCount;
        this.tvdbId = tvShow.tvdbId;
        this.id = tvShow.id;
        this._id = tvShow.tvdbId.toString();
        this.images = tvShow.images;
        this.genres = tvShow.genres;
        this.firstAired = tvShow.firstAired;
        this.status = tvShow.status;
        this.year = tvShow.year;
        this.overview = tvShow.overview;
        this.seasons = tvShow.seasons;
        
    }
}