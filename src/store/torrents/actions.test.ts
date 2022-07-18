import * as actions from "./actions";
import * as types from "./types";
import { AnyAction } from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import configureMockStore from "redux-mock-store";
import {preferences} from '../../../tools/mockData.js';
import ClientRequestManager from "../../api/qbitorrent/qBitorrentClient";

const middleware = [thunk];
const mockStore = configureMockStore<types.TorrentState, ThunkDispatch<types.TorrentState, Record<string, never>, AnyAction>>(middleware);

describe("async actions", () => {
    it('should create FETCH_PREFERENCES_SUCCESS when loading preferences', async () => {
        ClientRequestManager.prototype.authenticate = jest.fn(() => Promise.resolve("COOKIE_MONSTER"));
        ClientRequestManager.prototype.getAppPreferences = jest.fn(() => Promise.resolve(preferences));

        const store = mockStore({ torrents: {}, preferences: { ...preferences, saved: false }, error: "", loading: false });
        await store.dispatch(actions.loadPreferences());

        expect(store.getActions().length).toBe(1);
        expect(store.getActions()[0]).toEqual(actions.fetchPreferencesSuccess(preferences));
    });
});

describe("savePreferencesSuccess", () => {
    it('should create a SAVE_PREFERENCES_SUCCESS action', () => {
        const expectedAction = {
            type: types.TorrentActionTypes.SAVE_PREFERENCES_SUCCESS,
            payload: { preferences: { listen_port: 1999 } }
        };

        const action = actions.savePreferencesSuccess({ listen_port: 1999 });

        expect(action).toEqual(expectedAction);
    });
})