import { Reducer } from "redux";
import { MediaDetailsState, MediaDetailsActions, MediaDetailsActionTypes } from "./types";

export const initialState : MediaDetailsState = {
    tvlookupresults: [],
    error: "",
    loading: true
};

const reducer: Reducer<MediaDetailsState> = (state: MediaDetailsState = initialState, action) => {
    switch ((action as MediaDetailsActions).type) {
        case MediaDetailsActionTypes.LOOKUP_TV_SERIES_SUCCESS: {
            return { ...state, results: action.payload.results, error: "", loading: false };
        }
        case MediaDetailsActionTypes.LOOKUP_TV_SERIES_FAILED: {
            return { ...state, error: action.payload.reason, loading: false };
        }
        default: 
            return state; 
    }
}

export default reducer;