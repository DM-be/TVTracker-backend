import { Image } from "./Image";


export interface RadarrMovieDTO {
    title: string;
    sortTitle: string;
    sizeOnDisk: number;
    status: string;
    overview: string;
    inCinemas: string;
    images: Image [];
    website: string;
    downloaded: boolean;
    year: number;
    hasFile: boolean;
    youTubeTrailerId: string;
    studio: string;
    path: string;
    profileId: number;
    monitored: boolean;
    minimumAvailability: string;
    runtime: number;
    lastInfoSync: string;
    cleanTitle: string;
    imdbId: string;
    tmdbId: number;
    titleSlug: string;
    genres: string [];
    tags: [];
    added: string;
    ratings: {
        votes: number;
        value: number;
    }
    alternativeTitles: string []
    qualityProfileId: number;
    id: number,
    rootFolderPath?: string;
}

