import { QBittorrentTorrentInfo } from "api/qbitorrent/types/QBittorrentTorrentsMethods"
import { Action } from "redux"

export interface TorrentState {
    torrents: {
        [hash: string]: QBittorrentTorrentInfo;
    }
}

export enum TorrentActionTypes {
    CREATE_TORRENT = '@@torrents/CREATE_TORRENT',
    LIST_TORRENTS = '@@torrents/LIST_TORRENTS',
    LIST_TORRENTS_SUCCESS = '@@torrents/LIST_TORRENTS_SUCCESS'
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

export interface ListTorrentsSuccess extends Action {
    type: TorrentActionTypes.LIST_TORRENTS_SUCCESS,
    payload: {
        torrents?: {
            [hash: string]: QBittorrentTorrentInfo;
        }
    }
}

export type TorrentActions = CreateTorrent | ListTorrents | ListTorrentsSuccess;