export interface UpdateMovieDTO {
    monitored?: boolean;
    downloaded?: boolean;
    grabbed?: boolean;
    radarrId: number;
    tmdbId: number;
}