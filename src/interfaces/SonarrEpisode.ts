import { SonarrEpisodeFile } from "./SonarrEpisodeFile";

export interface SonarrEpisode {
    seriesId: number;
    episodeFileId: number;
    episodeFile?: SonarrEpisodeFile;
    seasonNumber: number;
    episodeNumber: number;
    title: string;
    airDate: string;
    airDateUtc: string;
    overview: string;
    hasFile: boolean;
    monitored: boolean;
 //   tvDbEpisodeId: number; --> missing but still in api docs 
    id: number; 
}