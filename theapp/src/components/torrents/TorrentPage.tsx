import React, { useEffect, ChangeEvent, FormEvent, useState } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationState } from "../../store";
import * as torrentActions from "../../store/torrents/actions";
import { TorrentState } from "../../store/torrents/types";

interface DispatchProps {
    sync: (username: string, password: string) => void
}
type AllProps = DispatchProps & TorrentState;

const TorrentPage : React.FC<AllProps> = ({sync, torrents}) => {
    const [torrent, setTorrent] = useState("");

    useEffect(() => { sync("admin", "adminadmin"); }, []);
    
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
    }

    function handleChange({ target }: ChangeEvent<HTMLInputElement>) {
        setTorrent(target.value);
    }

    return (
    <>
        <h2>Torrents</h2>
        {Object.keys(torrents).map((t: string) => {
            return <p key={t}>{torrents[t].name}</p>    
        })}
        <form onSubmit={handleSubmit}>
            <h3>Add Torrent</h3>
            <input 
                type="text" 
                value={torrent}
                onChange={handleChange} />
            <button type="submit">Add</button>
        </form>
    </>
    )
}

const mapDispatchToProps = (dispatch: ThunkDispatch<TorrentState, Record<string, never>, AnyAction>): DispatchProps => {
    return {
      sync: async (username: string, password: string) => {
        await dispatch(torrentActions.loadTorrents(username, password))
        console.log('torrents synced')
      }
    }
  }

const mapStateToProps = (state: ApplicationState) => state.torrent;

export default connect(mapStateToProps, mapDispatchToProps)(TorrentPage);