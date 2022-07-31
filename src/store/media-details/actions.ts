import { AnyAction, ActionCreator } from "redux";
import {MediaDetailsState, LookupTvSeriesFailed, LookupTvSeriesSuccess, MediaDetailsActionTypes } from "./types";
import SonarrAPI, { SeriesLookup } from "../../api/sonarr"
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import axios from "axios";

export const lookupTvSeriesSuccess : ActionCreator<LookupTvSeriesSuccess> = (results: SeriesLookup[]) => ({
    type: MediaDetailsActionTypes.LOOKUP_TV_SERIES_SUCCESS, 
    payload: { results }
})

export const lookupTvSeriesFailed : ActionCreator<LookupTvSeriesFailed> = (reason: string) => ({
    type: MediaDetailsActionTypes.LOOKUP_TV_SERIES_FAILED,
    payload: { reason }
})

export const lookupTvSeries = (series: string): ThunkAction<void, MediaDetailsState, Record<string, never>, AnyAction> => {
    // Invoke API
    return async (dispatch: ThunkDispatch<MediaDetailsState, Record<string, never>, AnyAction>) => {
        const sonarrApi = new SonarrAPI({
            url: process.env.SONARR_API_URL ?? "",
            apiKey: process.env.SONARR_API_KEY ?? ""
        });
        try {
            const response = await sonarrApi.get<SeriesLookup[]>("/series/lookup", { "term": series });
            dispatch(lookupTvSeriesSuccess(response));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                dispatch(lookupTvSeriesFailed(`Having problems previewing media details : ${error.message}`));
            } else {
                dispatch(lookupTvSeriesFailed("Having problems previewing media details :/"));
            }
        }
    }
}