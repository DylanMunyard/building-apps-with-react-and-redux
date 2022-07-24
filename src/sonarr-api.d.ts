declare module "sonarr-api" {
    export type SonarrAPISettings = {
        hostname:   string;
        apiKey:     string;
        port:       number;
        urlBase?:   string;
        ssl?:       boolean;
        username?:  string;
        password?:  string;
    }

    export default class SonarrAPI {
        constructor(options: SonarrAPISettings);

        get<T>(relativeUrl: string, parameters: { [key: string]: string }): Promise<T>;
    }

    export interface SeriesLookup {
        title:             string;
        sortTitle:         string;
        seasonCount:       number;
        status:            string;
        overview:          string;
        network:           string;
        airTime:           string;
        images:            Image[];
        remotePoster:      string;
        seasons:           Season[];
        year:              number;
        profileId:         number;
        seasonFolder:      boolean;
        monitored:         boolean;
        useSceneNumbering: boolean;
        runtime:           number;
        tvdbId:            number;
        tvRageId:          number;
        tvMazeId:          number;
        firstAired:        Date;
        seriesType:        string;
        cleanTitle:        string;
        imdbId:            string;
        titleSlug:         string;
        certification:     string;
        genres:            string[];
        tags:              string[];
        added:             Date;
        ratings:           Ratings;
        qualityProfileId:  number;
    }
    
    export interface Image {
        coverType: string;
        url:       string;
    }
    
    export interface Ratings {
        votes: number;
        value: number;
    }
    
    export interface Season {
        seasonNumber: number;
        monitored:    boolean;
    }


}