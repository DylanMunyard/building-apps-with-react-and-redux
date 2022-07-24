import { AnyAction, Action, combineReducers, Dispatch, Reducer } from "redux";
import { RouterState } from "redux-first-history";

import { TorrentState } from "./torrents/types";
import torrentReducer from "./torrents/reducer";
import { MediaDetailsState } from "./media-details/types";
import mediaDetailsReducer from "./media-details/reducer";

export interface ApplicationState {
    router: RouterState,
    torrent: TorrentState,
    mediadetails: MediaDetailsState
}

export interface ConnectedReduxProps<S extends Action> {
    dispatch: Dispatch<S>
}

const rootReducer = (routerState: Reducer<RouterState, AnyAction>) : Reducer<ApplicationState> =>  
    combineReducers<ApplicationState>({
        router: routerState,
        torrent: torrentReducer,
        mediadetails: mediaDetailsReducer
    });

export default rootReducer;