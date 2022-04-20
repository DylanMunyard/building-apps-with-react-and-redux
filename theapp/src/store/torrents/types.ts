import { QBittorrentAppPreferences } from 'api/qbitorrent/types/QBittorrentAppMethods';
import { QBittorrentTorrentInfo } from "api/qbitorrent/types/QBittorrentTorrentsMethods"
import { Action } from "redux"

export interface TorrentState extends ApiCall {
    torrents: {
        [hash: string]: QBittorrentTorrentInfo;
    },
    preferences?: TorrentPreferencesState
}

export interface ApiCall {
    error: string,
    loading: boolean
}

export interface TorrentPreferencesState {
    listen_port:                            number;
    upnp:                                   boolean;
    random_port:                            boolean;
    max_connec:                             number;
    max_connec_per_torrent:                 number;
    max_uploads:                            number;
    max_uploads_per_torrent:                number;
    readonly saved:                         boolean;
}

export enum TorrentActionTypes {
    CREATE_TORRENT = '@@torrents/CREATE_TORRENT',
    LIST_TORRENTS = '@@torrents/LIST_TORRENTS',
    LIST_TORRENTS_SUCCESS = '@@torrents/LIST_TORRENTS_SUCCESS',
    LIST_TORRENTS_FAILED = '@@torrents/LIST_TORRENTS_FAILED',
    FETCH_PREFERENCES = '@@torrents/FETCH_PREFERENCES',
    FETCH_PREFERENCES_SUCCESS = '@@torrents/FETCH_PREFERENCES_SUCCESS',
    FETCH_PREFERENCES_FAILED = '@@torrents/FETCH_PREFERENCES_FAILED',
    SAVE_PREFERENCES = '@@torrents/SAVE_PREFERENCES',
    SAVE_PREFERENCES_SUCCESS = '@@torrents/SAVE_PREFERENCES_SUCCESS',
    SAVE_PREFERENCES_FAILED = '@@torrents/SAVE_PREFERENCES_FAILED',
    SAVE_PREFERENCES_DONE = '@@torrents/SAVE_PREFERENCES_DONE'
}

export interface CreateTorrent extends Action {
    type: TorrentActionTypes.CREATE_TORRENT,
    payload: {
        torrent: string
    }
}

export interface ListTorrents extends Action {
    type: TorrentActionTypes.LIST_TORRENTS
}

export interface ListTorrentsFailed extends Action {
    type: TorrentActionTypes.LIST_TORRENTS_FAILED,
    payload: {
        reason: string
    }
}

export interface ListTorrentsSuccess extends Action {
    type: TorrentActionTypes.LIST_TORRENTS_SUCCESS,
    payload: {
        torrents?: {
            [hash: string]: QBittorrentTorrentInfo;
        }
    }
}

export interface FetchPreferencesFailed extends Action {
    type: TorrentActionTypes.FETCH_PREFERENCES_FAILED,
    payload: {
        reason: string
    }
}

export interface FetchPreferencesSuccess extends Action {
    type: TorrentActionTypes.FETCH_PREFERENCES_SUCCESS,
    payload: {
        preferences?: QBittorrentAppPreferences
    }
}
export interface SavePreferencesFailed extends Action {
    type: TorrentActionTypes.SAVE_PREFERENCES_FAILED,
    payload: {
        reason: string
    }
}

export interface SavePreferencesSuccess extends Action {
    type: TorrentActionTypes.SAVE_PREFERENCES_SUCCESS
}

export interface SavePreferencesDone extends Action {
    type: TorrentActionTypes.SAVE_PREFERENCES_DONE
}

export type TorrentActions = CreateTorrent | 
                             ListTorrents | 
                             ListTorrentsSuccess | 
                             ListTorrentsFailed |
                             FetchPreferencesSuccess | 
                             FetchPreferencesFailed |
                             SavePreferencesSuccess | 
                             SavePreferencesFailed |
                             SavePreferencesDone;