import React, { useState, useEffect } from "react";
import ptn, { Tv } from 'parse-torrent-name';
import fanArt from "../../assets//media-details/fanart.png";
import { ApplicationState } from "../../store";
import { SeriesLookup } from "sonarr-api"
import * as mediaDetailsActions from "../../store/media-details/actions";
import { MediaDetailsState } from "../../store/media-details/types";
import Loading from "components/loading";import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

interface DispatchProps {
    lookup: (name: string) => void
}

type Props = {
    name: string,
    tvlookupresults: SeriesLookup[],
    error: string,
    loading: boolean
}

type AllProps = DispatchProps & Props;

const MediaDetails: React.FC<AllProps> = ({ lookup, error, loading, name, tvlookupresults }) => {
    const details = ptn(name);
    const [errors, setErrors] = useState(error);

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
        if (!tv.title) return;
        
        lookup(tv.title);
    }, [tv.title]);

    return (<>
        {errors &&
        <div className="alert alert-danger" role="alert">
            <h3>Whoops There It Is!</h3>
            {errors}
        </div>}

        {loading &&
        <div className="card" style={{width: "18rem"}}>
            <div className="card-body">
                <Loading text="TV details loading" />
            </div>
        </div>}

        {!loading &&  tv.season && 
        <div className="card" style={{width: "18rem"}}>
            <img src={fanArt} className="card-img-top" alt={tv.title} />      
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{tv.title}</p>
                <a href="#" className="btn btn-primary">TheTVDB.com</a>
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

const mapStateToProps = (state: ApplicationState) : Props => {
    return { 
        ...state.mediadetails,
        name: ""
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaDetails);