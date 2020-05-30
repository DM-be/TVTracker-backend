import { AddOptions } from './../../interfaces/AddOptions';
import { RadarrService } from './../../services/radarr/radarr.service';
import { Command } from './Command';
import { DataLayer } from '../datalayers/DataLayer';
import { RadarrMovie } from 'src/interfaces/radarr/RadarrMovie';
import { exec } from 'child_process';
export class AddMovieCommand implements Command {


    // generate complete movie out of incomplete movie object

    /**
     *
     */
    constructor(private radarrService: RadarrService, private dataLayer: DataLayer, private radarrMovie: RadarrMovie) {
    }

    async execute() {
        try {
            const newRadarrMovieWithAddedProperties = await this.radarrService.lookupMovie(this.radarrMovie.tmdbId);
            newRadarrMovieWithAddedProperties.addOptions = this.radarrMovie.addOptions;
            newRadarrMovieWithAddedProperties.qualityProfileId = this.radarrMovie.qualityProfileId;
            newRadarrMovieWithAddedProperties.id = await this.radarrService.addMovie(newRadarrMovieWithAddedProperties);
            console.log(newRadarrMovieWithAddedProperties.qualityProfileId);
            newRadarrMovieWithAddedProperties.addOptions = undefined;
            newRadarrMovieWithAddedProperties._id = this.radarrMovie._id;
            await this.dataLayer.updateMovie(newRadarrMovieWithAddedProperties);
        } catch (error) {
            console.log(error);
        }
    }





}