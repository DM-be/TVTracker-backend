import { AddOptions } from "./AddOptions";
import { Image } from "./Image";
import { SonarrSeason } from "./SonarrSeason";
import { AddTvShowEpisode } from "./AddTvShowEpisode";

export interface AddTvShowDTO {
    tvdbId: number; //used to lookup
    title: string;
    qualityProfileId: number;
    titleSlug?: string; // set by lookup first
    images: Image [];
    seasons: SonarrSeason []; 
    addOptions: AddOptions;
    episodes?: AddTvShowEpisode [];
    path?: string;
    seasonFolder?: boolean;

    _deleted?: boolean;
    _id?: string;
}
