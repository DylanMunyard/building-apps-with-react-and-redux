import React, { useState, useEffect } from "react";
import ptn, { Tv } from 'parse-torrent-name';
import { ApplicationState } from "../../store";
import { SeriesLookup } from "../../api/sonarr"
import * as mediaDetailsActions from "../../store/media-details/actions";
import { MediaDetailsState } from "../../store/media-details/types";
import Loading from "components/loading";import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

interface DispatchProps {
    lookup: (name: string) => void
}

type Props = {
    mediaName: string,
    tvlookupresults: SeriesLookup[],
    error: string,
    loading: boolean
}

type AllProps = DispatchProps & Props;

const MediaDetails: React.FC<AllProps> = ({ lookup, error, loading, mediaName, tvlookupresults }) => {
    const details = ptn(mediaName);
    const [errors, setErrors] = useState(error);
    const [mediaDetails, setMediaDetails] = useState<Partial<SeriesLookup>>({});

    useEffect(() => {
        if (!tvlookupresults.length) return;

        setMediaDetails(tvlookupresults[0]);
    }, [tvlookupresults.length]);

    useEffect(() => {
        setErrors(error);
    }, [error]);

    // Clear every after season number: expecting <Title> s01 | <Title> s02-s03 | <Title> Season 1
    const seasonMatch = details.title.match(/s(?<short>\d{1,2}).*|season (?<long>\d{1,2}).*/i);
    if (seasonMatch) {
        const { "short": shortSeason, "long": longSeason } = seasonMatch.groups as { [key: string]: string };
        (details as Tv).season = parseInt(shortSeason ?? longSeason, 10);
    }
    
    details.title = details.title.replace(/s\d{1,2}.*/i, "");
    details.title = details.title.replace(/season \d{1,2}.*/i, "");
    
    // Clear year numbers from the end of the title: expecting <Title> 2021
    details.title = details.title.replace(/\d{4}$/i, "");
    
    // Remove excess whitespace
    details.title = details.title.trim();

    const tv = details as Tv;

    let title = `Full Season ${tv.season}`;
    if (tv.episode) {
        title = `Episode ${tv.episode} / Season ${tv.season}`;
    }

    useEffect(() => {
        if (!details.title) return;
        console.info(details);

        lookup(tv.title);
    }, [details.title]);

    return (<>
        {errors &&
        <div className="card text-bg-danger mb-3" style={{width: "18rem"}}>
            <div className="card-body">
                <h5 className="card-title">Whoops</h5>
                <p className="card-text">{errors}</p>
            </div>      
        </div>}

        {tv.season && loading &&
        <div className="card" style={{width: "18rem"}}>
            <div className="card-body">
                <Loading text="TV details loading" />
            </div>
        </div>}

        {!loading &&  mediaDetails && tv.season && 
        <div className="card" style={{width: "18rem"}}>
            <img src={mediaDetails.images ? mediaDetails.images[0].url : ""} className="card-img-top" alt={mediaDetails.title} />      
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{mediaDetails.overview}</p>
                <a href={`https://thetvdb.com/index.php?tab=series&id=${mediaDetails.tvdbId}`} className="btn btn-primary">TheTVDB.com</a>
            </div>
        </div>}
    </>);
}

const mapDispatchToProps = (dispatch: ThunkDispatch<MediaDetailsState, Record<string, never>, AnyAction>): DispatchProps => {
    return {
      lookup: async (name: string) => {
        await dispatch(mediaDetailsActions.lookupTvSeries(name));
      }
    }
  }

const mapStateToProps = (state: ApplicationState, props: { mediaName: string }) : Props => {
    return { 
        ...state.mediadetails,
        mediaName: props.mediaName
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaDetails);