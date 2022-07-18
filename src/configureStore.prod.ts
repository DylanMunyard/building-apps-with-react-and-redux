// https://medium.com/@resir014/redux-4-typescript-2-9-a-type-safe-approach-7f073917b803

import { createStore, applyMiddleware, Store } from "redux";
import createRootReducer, { ApplicationState } from "./store";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import thunk from "redux-thunk";

const { 
    createReduxHistory, 
    routerMiddleware, 
    routerReducer 
} = createReduxHistoryContext({ history: createBrowserHistory() });

export const store : Store<ApplicationState> = createStore(
    createRootReducer(routerReducer),
    applyMiddleware(thunk, routerMiddleware)
);

export const history = createReduxHistory(store);