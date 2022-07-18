import { AnyAction, Action, combineReducers, Dispatch, Reducer } from "redux";
import { RouterState } from "redux-first-history";

import { TorrentState } from "./torrents/types";
import torrentReducer from "./torrents/reducer";

export interface ApplicationState {
    router: RouterState,
    torrent: TorrentState
}

export interface ConnectedReduxProps<S extends Action> {
    dispatch: Dispatch<S>
}

const rootReducer = (routerState: Reducer<RouterState, AnyAction>) : Reducer<ApplicationState> =>  
    combineReducers<ApplicationState>({
        router: routerState,
        torrent: torrentReducer
    });

export default rootReducer;