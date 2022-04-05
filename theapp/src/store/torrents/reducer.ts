import { Reducer } from "redux";
import { TorrentState, TorrentActions, TorrentActionTypes } from "./types";

export const initialState : TorrentState = {
    torrents: {}
};

const reducer: Reducer<TorrentState> = (state: TorrentState = initialState, action) => {
    switch ((action as TorrentActions).type) {
        case TorrentActionTypes.LIST_TORRENTS_SUCCESS: {
            return { ...state, torrents: action.payload.torrents };
        }
        default: 
            return state; 
    }
}

export default reducer;