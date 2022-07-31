import { SeriesLookup } from "../../api/sonarr"
import { Action } from "redux"

export interface MediaDetailsState extends ApiCall {
    tvlookupresults: SeriesLookup[]
}

export interface ApiCall {
    error: string,
    loading: boolean
}

export enum MediaDetailsActionTypes {
    LOOKUP_TV_SERIES_SUCCESS = '@@mediadetails/LOOKUP_TV_SERIES_SUCCESS',
    LOOKUP_TV_SERIES_FAILED = '@@mediadetails/LOOKUP_TV_SERIES_FAILED'
}

export interface LookupTvSeriesFailed extends Action {
    type: MediaDetailsActionTypes.LOOKUP_TV_SERIES_FAILED,
    payload: { reason: string }
}

export interface LookupTvSeriesSuccess extends Action {
    type: MediaDetailsActionTypes.LOOKUP_TV_SERIES_SUCCESS,
    payload: { results: SeriesLookup[] }
}

export type MediaDetailsActions = LookupTvSeriesSuccess | 
                                  LookupTvSeriesFailed;