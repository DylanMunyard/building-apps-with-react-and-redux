import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationState } from "../../store";
import * as torrentActions from "../../store/torrents/actions";
import { TorrentState } from "../../store/torrents/types";
import { DisplayBytes } from "api/helper"

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

    console.log(torrents);

    return (
    <>
        <h1>Torrents</h1>
        {error && 
            <>
                <div className="alert alert-danger" role="alert">
                    <h3>Whoops!</h3>
                    {error}
                </div>
            </>
         }
         {loading && 
            <>
                <p>Torrents are loading ... </p>
            </>
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
                        <td>{torrents[t].name}</td>
                        <td>{DisplayBytes(torrents[t].size)}</td>
                        <td>{DisplayBytes(torrents[t].uploaded)}</td>
                        <td>{DisplayBytes(torrents[t].downloaded)}</td>
                    </tr>
                })}
            </tbody>
            </table>
        }
    </>
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