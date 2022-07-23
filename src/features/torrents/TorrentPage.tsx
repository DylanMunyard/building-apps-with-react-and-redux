import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationState } from "../../store";
import * as torrentActions from "../../store/torrents/actions";
import { TorrentState } from "../../store/torrents/types";
import { DisplayBytes } from "api/helper";
import { useParams } from 'react-router-dom';
import Loading from "../common/Loading";

interface DispatchProps {
    sync: () => void
}
interface Props extends TorrentState {
    num_torrents: number,
}
type AllProps = Props & DispatchProps;

const TorrentPage : React.FC<AllProps> = ({ sync, num_torrents, loading, error, torrents }) => {
    const { id } = useParams();
    const [torrent, setTorrent] = useState(torrents[id ?? "404"]);
    const [ratio, setRatio] = useState(0);
    
    useEffect(() => { 
        if (num_torrents === 0) {
            sync();
        } 
    }, []);
    
    useEffect(() => { 
        setTorrent(torrents[id ?? "404"]);
    }, [num_torrents]);

    useEffect(() => {
        if (!torrent) return;

        setRatio(Math.min(100, (torrent.uploaded / torrent.downloaded) * 100));
    }, [torrent]);

    const ratioClass = () => {
        if (ratio < 20) return "bg-danger";

        if (ratio < 40) return "bg-warning";

        if (ratio < 60) return "bg-info";

        return "bg-success";
    }

    return (<div className="col">
        {error && 
            <>
                <div className="alert alert-danger" role="alert">
                    <h3>Whoops!</h3>
                    {error}
                </div>
            </>
         }
         {loading &&
            <Loading text="Loading torrent details" />
        }
        {torrent && <>
            <h1>{torrent.name}</h1>
            <div className="mb-3">
                <div className="progress" style={ { width: "20%" }}>
                    <div className={`progress-bar ${ratioClass()}`} role="progressbar" aria-label="Ratio" style={ { width: ratio + "%" } } aria-valuenow={ratio} aria-valuemin={0} aria-valuemax={100}></div>
                </div>
            </div>
            <div className="mb-3">
                Uploaded: {DisplayBytes(torrent.uploaded)}
            </div>
            <div className="mb-3">
                Downloaded: {DisplayBytes(torrent.downloaded)}
            </div>
        </>}
    </div>);
};

const mapDispatchToProps = (dispatch: ThunkDispatch<TorrentState, Record<string, never>, AnyAction>): DispatchProps => {
    return {
        sync: async () => {
        await dispatch(torrentActions.loadTorrents())
        console.log('torrents synced')
        }
    }
}

const mapStateToProps = (state: ApplicationState) : Props => {
    return { 
        ...state.torrent, 
        num_torrents: Object.keys(state.torrent.torrents).length
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TorrentPage);