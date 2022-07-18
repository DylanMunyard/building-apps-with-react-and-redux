import reducer from "./reducer";
import * as actions from "./actions";
import { TorrentPreferencesState, TorrentState } from "./types";
import {mainData, preferences} from '../../../tools/mockData.js';
import {QBittorrentTorrentInfo} from '../../api/qbitorrent/types/QBittorrentTorrentsMethods';

it("should save preferences when passed SAVE_PREFERENCES_SUCCESS", () => {
    // arrange
    const torrents : {
        [hash: string]: QBittorrentTorrentInfo;
    } = {};
    
    Object.keys(mainData.torrents).forEach((torrent) => {
        torrents[torrent] = {
            ...torrents[torrent]
        };
    });

    const initialState: TorrentState  = {
        error: "",
        loading: false,
        torrents, 
        preferences: { ...preferences, saved: false }
    };

    const updatePreferences: TorrentPreferencesState = {
        listen_port: 1818,
        max_connec: 10,
        max_connec_per_torrent: -1,
        max_uploads: 10,
        max_uploads_per_torrent: -1,
        random_port: true,
        saved: false,
        upnp: false 
    };

    const action = actions.savePreferencesSuccess(updatePreferences);

    // act
    const newState = reducer(initialState, action);

    // assert
    expect(newState.preferences?.listen_port).toEqual(updatePreferences.listen_port);
    expect(newState.preferences?.saved).toEqual(true);
    expect(initialState.preferences?.listen_port).toEqual(preferences.listen_port);
});