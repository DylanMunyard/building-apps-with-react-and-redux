import { createStore, applyMiddleware, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createRootReducer, { ApplicationState } from "./store";
import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory } from "history";
import thunk from "redux-thunk";

const { 
    createReduxHistory, 
    routerMiddleware, 
    routerReducer 
} = createReduxHistoryContext({ history: createBrowserHistory() });

const composeEnhancers = composeWithDevTools({});

export const store : Store<ApplicationState> = createStore(
    createRootReducer(routerReducer),
    composeEnhancers(applyMiddleware(thunk, routerMiddleware))
);

export const history = createReduxHistory(store);