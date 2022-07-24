import axios from 'axios';

export type SonarrAPISettings = {
    url:   string;
    apiKey:     string;
}

export default class SonarrAPI {
    private connectionSettings: SonarrAPISettings;
    private apiBase: string;

    constructor(options: SonarrAPISettings) {
        this.connectionSettings = options;
        this.apiBase = `${this.connectionSettings.url}/api`;
    }

    async get<T>(relativeUrl: string, parameters: { [key: string]: string }): Promise<T> {
        return axios
            .get<T>(`${this.apiBase}${relativeUrl}`, {
                params: {
                    ...parameters,
                    apikey: this.connectionSettings.apiKey
                }
            })
            .then((res) => res.data)
            .catch(reason => {
                throw reason
            });
    }
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