import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationState } from "../../store";
import * as torrentActions from "../../store/torrents/actions";
import { TorrentState } from "../../store/torrents/types";
import { DisplayBytes } from "api/helper";
//import { Link } from "react-router-dom";
import Loading from "../../components/loading";
import { QBittorrentTorrentInfo } from "api/qbitorrent/types/QBittorrentTorrentsMethods";
import DataGrid from "react-data-grid";
import 'react-data-grid/dist/react-data-grid.css';
import "./TorrentList.css";

interface DispatchProps {
    sync: () => void
}
interface Props extends TorrentState {
    num_torrents: number,
}

type AllProps = DispatchProps & Props;

type TableCols = {
    key: Partial<keyof QBittorrentTorrentInfo>,
    name: string
}

type TableRows<QBittorrentTorrentInfo> = {
    [Col in keyof QBittorrentTorrentInfo]?: unknown
}

const TorrentList : React.FC<AllProps> = ({sync, num_torrents, loading, error, torrents}) => {
    useEffect(() => { 
        if (num_torrents === 0) {
            sync();
        } 
    }, []);

    const [filteredTorrents, setFilteredTorrents] = useState(toDataRows(torrents));
    const [filter, setFilter] = useState("");

    const columns : TableCols[] = [
        { key: "name", name: 'Name' },
        { key: "size", name: 'Size' },
        { key: "uploaded", name: 'Uploaded' },
        { key: "downloaded", name: 'Downloaded' }
    ];

    const changeFilter = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setFilter(target.value);
    };

    useEffect(() => {
        const results : {[hash: string]: QBittorrentTorrentInfo} = {};
        if (!filter) {
            setFilteredTorrents(toDataRows(torrents));
            return;
        }
        
        Object.keys(torrents).forEach((torrent) => {
            if (torrents[torrent].name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
                results[torrent] = torrents[torrent];
            }
            });
        setFilteredTorrents(toDataRows(results));
    }, [torrents, filter]);

    function toDataRows(rows: { [hash: string]: QBittorrentTorrentInfo }) : TableRows<QBittorrentTorrentInfo>[] {
        const dataRows : TableRows<QBittorrentTorrentInfo>[] = [];

        Object.keys(rows).sort((a: string, b: string) => {
            return rows[a].name.localeCompare(rows[b].name);
        }).forEach((hash) => {
            const row = rows[hash];
            dataRows.push({ 
                "name": row.name,
                "size": DisplayBytes(row.size),
                "uploaded": DisplayBytes(row.uploaded),
                "downloaded": DisplayBytes(row.downloaded)
            });
        });

        return dataRows;
    }

    function preventSubmit(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            return false;
        }
    }

    return (
        <div className="col">
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
                <Loading text="Loading torrents" />
            }
            {num_torrents > 0 && <>
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
                
                <div className="torrent-list-container">
                    <DataGrid className="fill-grid" columns={columns} rows={filteredTorrents}  />
                </div>
            </>}
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