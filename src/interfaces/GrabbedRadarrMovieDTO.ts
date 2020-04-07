export interface GrabbedMovie {
    id: number;
    title: string;
    releaseDate: string
}


export interface GrabbedRemoteMovie {
    tmdbId: number;
    imdbId: string;
    title: string;
    year: number;
}

export interface GrabbedRelease {
    quality: string;
    qualityVersion: number;
    releaseGroup: string;
    releaseTitle: string;
    indexer: string;
    size: number
}


export interface GrabbedRadarrMovieDTO {
    eventType: string;
    movie: GrabbedMovie;
    remoteMovie: GrabbedRemoteMovie;
    release: GrabbedRelease;
}

/*
curl --header "Content-Type: application/json" \
  --request POST \
  --data \
'{
    "eventType": "Grab",
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
    "release": {
        "quality": "DVD",
        "qualityVersion": 1,
        "releaseGroup": "XME",
        "releaseTitle": "Finding.Nemo.2003.iNTERNAL.DVDRip.x264-XME",
        "indexer": "NZBgeek",
        "size": 2172672000
    }
}' http://localhost:3000/movies/webhook/grab


*/