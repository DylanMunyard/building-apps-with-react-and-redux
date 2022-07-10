import { QBittorrentAppPreferences } from 'api/qbitorrent/types/QBittorrentAppMethods';
import axios from "axios";
import { AnyAction, ActionCreator } from "redux";
import {TorrentState, TorrentPreferencesState, CreateTorrent, ListTorrentsSuccess, ListTorrentsFailed, FetchPreferencesSuccess, FetchPreferencesFailed, SavePreferencesSuccess, SavePreferencesFailed, SavePreferencesDone, TorrentActionTypes } from "./types";
import qBitorrentClient from "api/qbitorrent/qBitorrentClient";
import type {QBittorrentConnectionSettings} from '@shared/schema/ClientConnectionSettings';
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { QBittorrentMainData } from "api/qbitorrent/types/QBittorrentSyncMethods";

export const createTorrent : ActionCreator<CreateTorrent> = (torrent: string) => ({
    type: TorrentActionTypes.CREATE_TORRENT,
    payload: {
        torrent: torrent
    }
})

export const listTorrentsSuccess : ActionCreator<ListTorrentsSuccess> = (torrents: QBittorrentMainData) => ({
    type: TorrentActionTypes.LIST_TORRENTS_SUCCESS, 
    payload: {
        torrents: torrents.torrents
    }
})

export const listTorrentsFailed : ActionCreator<ListTorrentsFailed> = (reason: string) => ({
    type: TorrentActionTypes.LIST_TORRENTS_FAILED,
    payload: { reason }
})

export const fetchPreferencesSuccess : ActionCreator<FetchPreferencesSuccess> = (preferences: QBittorrentAppPreferences) => ({
    type: TorrentActionTypes.FETCH_PREFERENCES_SUCCESS, 
    payload: {
        preferences: preferences
    }
})

export const fetchPreferencesFailed : ActionCreator<FetchPreferencesFailed> = (reason: string) => ({
    type: TorrentActionTypes.FETCH_PREFERENCES_FAILED,
    payload: { reason }
})

export const savePreferencesSuccess : ActionCreator<SavePreferencesSuccess> = () => ({
    type: TorrentActionTypes.SAVE_PREFERENCES_SUCCESS
})

export const savePreferencesFailed : ActionCreator<SavePreferencesFailed> = (reason: string) => ({
    type: TorrentActionTypes.SAVE_PREFERENCES_FAILED,
    payload: { reason }
})

export const savePreferencesDone : ActionCreator<SavePreferencesDone> = () => ({
    type: TorrentActionTypes.SAVE_PREFERENCES_DONE
})

export const loadTorrents = (): ThunkAction<void, TorrentState, Record<string, never>, AnyAction> => {
    // Invoke API
    return async (dispatch: ThunkDispatch<TorrentState, Record<string, never>, AnyAction>) => {
        const qSettings : QBittorrentConnectionSettings = {
            client: "qBittorrent",
            username: process.env.API_USERNAME || "",
            password: process.env.API_PASSWORD || "",
            url: process.env.API_URL || "",
            type: "web",
            version: 1
        };
        const qClient = new qBitorrentClient(qSettings);
        try {
            const response = await qClient.syncMainData();
            dispatch(listTorrentsSuccess(response));
        } catch (error) {
            if (axios.isAxiosError(error))  {
                dispatch(listTorrentsFailed(error.message));
            } else {
                dispatch(listTorrentsFailed(error));
            }
        }
    }
}

export const loadPreferences = (): ThunkAction<void, TorrentState, Record<string, never>, AnyAction> => {
    // Invoke API
    return async (dispatch: ThunkDispatch<TorrentState, Record<string, never>, AnyAction>) => {
        const qSettings : QBittorrentConnectionSettings = {
            client: "qBittorrent",
            username: process.env.API_USERNAME || "",
            password: process.env.API_PASSWORD || "",
            url: process.env.API_URL || "http://192.168.86.210:8080",
            type: "web",
            version: 1
        };
        const qClient = new qBitorrentClient(qSettings);
        try {
            const response = await qClient.getAppPreferences();
            dispatch(fetchPreferencesSuccess(response));
        } catch (error) {
            if (axios.isAxiosError(error))  {
                dispatch(fetchPreferencesFailed(error.message));
            } else {
                dispatch(fetchPreferencesFailed(error));
            }
        }
    }
}

export const updatePreferences = (preferences: Partial<TorrentPreferencesState>): ThunkAction<void, TorrentState, Record<string, never>, AnyAction> => {
    // Invoke API
    return async (dispatch: ThunkDispatch<TorrentState, Record<string, never>, AnyAction>) => {
        const qSettings : QBittorrentConnectionSettings = {
            client: "qBittorrent",
            username: process.env.API_USERNAME || "",
            password: process.env.API_PASSWORD || "",
            url: process.env.API_URL || "http://192.168.86.210:8080",
            type: "web",
            version: 1
        };
        const qClient = new qBitorrentClient(qSettings);
        try {
            await qClient.setAppPreferences(preferences);
            dispatch(savePreferencesSuccess());
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error))  {
                dispatch(savePreferencesFailed(error.message));
            } else {
                dispatch(savePreferencesFailed(error));
            }
        }
    }
}