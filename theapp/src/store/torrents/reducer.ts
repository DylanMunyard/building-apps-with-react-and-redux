import { Reducer } from "redux";
import { TorrentState, TorrentActions, TorrentActionTypes } from "./types";

export const initialState : TorrentState = {
    torrents: {},
    error: "",
    loading: true
};

const reducer: Reducer<TorrentState> = (state: TorrentState = initialState, action) => {
    switch ((action as TorrentActions).type) {
        case TorrentActionTypes.LIST_TORRENTS_SUCCESS: {
            return { ...state, torrents: action.payload.torrents, loading: false };
        }
        case TorrentActionTypes.LIST_TORRENTS_FAILED: {
            return { ...state, error: action.payload.reason, loading: false };
        }
        case TorrentActionTypes.FETCH_PREFERENCES_SUCCESS: {
            return { ...state, preferences: { ...action.payload.preferences, saved: false }, loading: false };
        }
        case TorrentActionTypes.FETCH_PREFERENCES_FAILED: {
            return { ...state, error: action.payload.reason, loading: false };
        }
        case TorrentActionTypes.SAVE_PREFERENCES_SUCCESS: {
            return { ...state, preferences: { ...state.preferences, saved: true }, loading: false };
        }
        case TorrentActionTypes.SAVE_PREFERENCES_FAILED: {
            return { ...state, error: action.payload.reason, loading: false };
        }
        case TorrentActionTypes.SAVE_PREFERENCES_DONE: {
            return { ...state, preferences: undefined, loading: false };
        }
        default: 
            return state; 
    }
}

export default reducer;