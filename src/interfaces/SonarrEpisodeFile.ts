export interface SonarrEpisodeFile {
    seriesId: number;
    seasonNumber: number;
    relativePath: string;
    path: string;
    size: number;
    dateAdded: string;
    sceneName: string;
    quality: {
        quality: {
            id: number;
            name: string;
            source: string;
            resolution: number;
        }
        revision: {
            version: number;
            real: number;
        }
    };
    mediaInfo: {
        audioChannels: number;
        audioCodec: string;
        videoCodec: string;
    };
    originalFilePath: string;
    qualityCutOffNotMet: true;
    id: number;

}