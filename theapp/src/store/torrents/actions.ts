import { AnyAction, ActionCreator } from "redux";
import {TorrentState, CreateTorrent, ListTorrents, ListTorrentsSuccess, TorrentActionTypes } from "./types";
import qBitorrentClient from "api/qbitorrent/qBitorrentClient";
import type {QBittorrentConnectionSettings} from '@shared/schema/ClientConnectionSettings';
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { QBittorrentMainData } from "api/qbitorrent/types/QBittorrentSyncMethods";

export const createTorrent : ActionCreator<CreateTorrent> = 
(torrent: string) => ({
    type: TorrentActionTypes.CREATE_TORRENT,
    payload: {
        torrent: torrent
    }
})

export const listTorrents : ActionCreator<ListTorrents> = 
() => ({
    type: TorrentActionTypes.LIST_TORRENTS
})

export const listTorrentsSuccess : ActionCreator<ListTorrentsSuccess> = 
(torrents: QBittorrentMainData) => ({
    type: TorrentActionTypes.LIST_TORRENTS_SUCCESS, 
    payload: {
        torrents: torrents.torrents
    }
})

export const loadTorrents = (username: string, password: string): ThunkAction<void, TorrentState, Record<string, never>, AnyAction> => {
    // Invoke API
    return async (dispatch: ThunkDispatch<TorrentState, Record<string, never>, AnyAction>) => {
        const qSettings : QBittorrentConnectionSettings = {
            client: "qBittorrent",
            username: username,
            password: password,
            url: process.env.API_URL || "http://localhost:3001",
            type: "web",
            version: 1
        };
        const qClient = new qBitorrentClient(qSettings);
        const response = await qClient.syncMainData();
        dispatch(listTorrentsSuccess(response));
    }
}