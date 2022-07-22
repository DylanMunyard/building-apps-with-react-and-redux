import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationState } from "../../store";
import * as torrentActions from "../../store/torrents/actions";
import { TorrentState } from "../../store/torrents/types";
import { DisplayBytes } from "api/helper";
import { Link } from "react-router-dom";
import Loading from "../common/Loading";
import { QBittorrentTorrentInfo } from "api/qbitorrent/types/QBittorrentTorrentsMethods";

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

    const [filteredTorrents, setFilteredTorrents] = useState(torrents);
    const [filter, setFilter] = useState("");

    const changeFilter = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setFilter(target.value);
    };

    useEffect(() => {
        const results : {[hash: string]: QBittorrentTorrentInfo} = {};
        if (!filter) {
            setFilteredTorrents(torrents);
            return;
        }
        
        Object.keys(torrents).forEach((torrent) => {
            if (torrents[torrent].name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
                results[torrent] = torrents[torrent];
            }
            });
        setFilteredTorrents(results);
    }, [torrents, filter]);

    function preventSubmit(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            return false;
        }
    }

    return (
        <div className="col">
            <h1>Torrents</h1>

            <form className="d-flex" role="search">
                <input 
                    className="form-control me-2" 
                    type="search" 
                    value={filter} 
                    placeholder="Filter" 
                    aria-label="Filter" 
                    onKeyDown={preventSubmit}
                    onChange={changeFilter} />
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
                    {Object.keys(filteredTorrents).sort((a: string, b: string) => {
                        return filteredTorrents[a].name.localeCompare(filteredTorrents[b].name);
                    }).map((t: string) => {
                        return <tr key={t}>
                            <td><Link to={`/torrents/${t}`}>{filteredTorrents[t].name}</Link></td>
                            <td>{DisplayBytes(filteredTorrents[t].size)}</td>
                            <td>{DisplayBytes(filteredTorrents[t].uploaded)}</td>
                            <td>{DisplayBytes(filteredTorrents[t].downloaded)}</td>
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