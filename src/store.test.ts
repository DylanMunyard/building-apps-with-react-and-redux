import { createStore, Store } from "redux";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import createRootReducer, { ApplicationState } from "./store";
import * as actions from "./store/torrents/actions";

it("Should handle updating preferences", () => {
    // arrange: given a router reducer
    const { 
        routerReducer 
    } = createReduxHistoryContext({ history: createBrowserHistory() });
    
    // and a store
    const store : Store<ApplicationState> = createStore(
        createRootReducer(routerReducer)
    );

    // act: when the save preferences action is dispatched
    store.dispatch(actions.savePreferencesSuccess({ listen_port: 22 }));

    // assert: preferences have been updated
    const preferences = store.getState().torrent.preferences;
    expect(preferences?.listen_port).toEqual(22);
});