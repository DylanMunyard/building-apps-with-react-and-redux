import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationState } from "../../store";
import * as torrentActions from "../../store/torrents/actions";
import { TorrentState } from "../../store/torrents/types";
import { DisplayBytes } from "api/helper";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";

interface DispatchProps {
    sync: () => void
}
interface Props extends TorrentState {
    num_torrents: number,
}

type AllProps = DispatchProps & Props;

const TorrentList : React.FC<AllProps> = ({sync, num_torrents, loading, error, torrents}) => {
    useEffect(() => { 
        if (num_torrents === 0) {
            sync();
        } 
    }, []);

    return (
        <div className="col">
            <h1>Torrents</h1>

            <form className="d-flex" role="search">
                <input className="form-control me-2" type="filter" placeholder="Filter" aria-label="Filter" />
                <button className="btn btn-outline-success" type="submit">Search</button>
            </form>

            {error && 
                <>
                    <div className="alert alert-danger" role="alert">
                        <h3>Whoops!</h3>
                        {error}
                    </div>
                </>
            }
            {loading && 
                <Loading text="Loading torrents" />
            }
            {num_torrents > 0 && 
                <table className="table table-condensed">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Uploaded</th>
                        <th>Downloaded</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(torrents).sort((a: string, b: string) => {
                        return torrents[a].name.localeCompare(torrents[b].name);
                    }).map((t: string) => {
                        return <tr key={t}>
                            <td><Link to={`/torrents/${t}`}>{torrents[t].name}</Link></td>
                            <td>{DisplayBytes(torrents[t].size)}</td>
                            <td>{DisplayBytes(torrents[t].uploaded)}</td>
                            <td>{DisplayBytes(torrents[t].downloaded)}</td>
                        </tr>
                    })}
                </tbody>
                </table>
            }
        </div>
    )
}

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

export default connect(mapStateToProps, mapDispatchToProps)(TorrentList);