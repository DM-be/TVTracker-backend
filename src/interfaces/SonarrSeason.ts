import { SonarrEpisode } from "./SonarrEpisode";


export interface SonarrSeason {
    seasonNumber: number;
    monitored: boolean;
    statistics?: any;
    episodes?: SonarrEpisode [];
}