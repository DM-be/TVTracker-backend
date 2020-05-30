export interface DownloadedRadarrMovieDTO {
    eventType: string;
    movie: DownloadedMovie;
    remoteMovie: DownloadedRemoteMovie;
    movieFile: DownloadedMovieFile;
}

export interface DownloadedMovie {
    id: number;
    title: string;
    releaseDate: string
}


export interface DownloadedRemoteMovie {
    tmdbId: number;
    imdbId: string;
    title: string;
    year: number;
}

export interface DownloadedMovieFile {
    quality: string;
    qualityVersion: number;
    releaseGroup: string;
    releaseTitle: string;
    id: number;
    relativePath: string;
    path: string;

}

/*

{
    "eventType": "Download",
    "movie": {
        "id": 2,
        "title": "Finding Nemo",
        "releaseDate": "2003-08-28"
    },
    "remoteMovie": {
        "tmdbId": 12,
        "imdbId": "tt0266543",
        "title": "Finding Nemo",
        "year": 2003
    },
    "movieFile": {
        "id": 2,
        "relativePath": "Finding Nemo (2003) DVD.mkv",
        "path": "Z:\\Finding.Nemo.2003.iNTERNAL.DVDRip.x264-REGRET\\regret-nemo.mkv",
        "quality": "DVD",
        "qualityVersion": 1,
        "releaseGroup": "REGRET"
    },
    "isUpgrade": false
}

*/


/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data \
'{
    "eventType": "Download",
    "movie": {
        "id": 114,
        "title": "Nocturnal Animals",
        "releaseDate": "2003-08-28"
    },
    "remoteMovie": {
        "tmdbId": 340666,
        "imdbId": "tt0266543",
        "title": "Nocturnal Animals",
        "year": 2003
    },
    "movieFile": {
        "id": 2,
        "relativePath": "Finding Nemo (2003) DVD.mkv",
        "path": "Z:\\Finding.Nemo.2003.iNTERNAL.DVDRip.x264-REGRET\\regret-nemo.mkv",
        "quality": "DVD",
        "qualityVersion": 1,
        "releaseGroup": "REGRET"
    },
    "isUpgrade": false
    
}' http://localhost:3000/movies/webhook/download


*/