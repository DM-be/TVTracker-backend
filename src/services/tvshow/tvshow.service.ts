import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { PouchService } from '../pouch/pouch.service';
import { AddTvShowDTO } from 'src/interfaces/AddTvShowDTO';
import { SonarrService } from '../sonarr/sonarr.service';

@Injectable()
export class TvshowService {
    /**
     *
     */
    constructor( @Inject(forwardRef(() => PouchService)) private pouchService: PouchService, private sonarrService: SonarrService) {
    
        
    }

    public async addTvShow(addTvShowDto: AddTvShowDTO) {

        try {
            let lookupDto = await this.sonarrService.lookupSonarrTvShow(addTvShowDto.tvdbId);
            addTvShowDto.titleSlug = lookupDto.titleSlug;
            const id = await this.sonarrService.addSonarrTvShow(addTvShowDto); // adds general show 
            await this.delay(4000);
            const sonarrTvShowDto = await this.sonarrService.getSonarrTvShow(id);
            await this.delay(4000); // sonarr backend is also async, add a custom delay to ensure the sonarr api has finished processing.
            // todo add error handling when episodes returned are empty! --> delay loop until thread in sonarr finished? delta function?
            const pouchTvShow = await this.pouchService.generatePouchTvShowWithImagesAndEpisodes(sonarrTvShowDto);
            if(addTvShowDto.episodes)
            {
                const episodeIds: number [] = [];
                addTvShowDto.episodes.forEach(episode => {
                    const sonarrSeason = pouchTvShow.seasons.find(e => e.seasonNumber === episode.seasonNumber)
                    if(sonarrSeason)
                    {
                        const sonarrEpisode = sonarrSeason.episodes.find(e => e.episodeNumber === episode.episodeNumber);
                        episodeIds.push(sonarrEpisode.id);
                    }
                });
               const resp = await this.sonarrService.searchEpisodes(episodeIds);
            }
            await this.pouchService.addPouchTvShowToCollection(pouchTvShow);
            } catch (error) {
                console.log(error);
            }
            
    }
    
    private delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}
