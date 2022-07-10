import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { connect } from "react-redux";
import { AnyAction } from "redux";
import {useNavigate} from "react-router-dom";
import { ThunkDispatch } from "redux-thunk";
import { ApplicationState } from "../../store";
import * as torrentActions from "../../store/torrents/actions";
import { TorrentPreferencesState, TorrentState } from "../../store/torrents/types"; 
import { toast } from "react-toastify";

interface DispatchProps {
    sync: () => void,
    update: (preferences: Partial<TorrentPreferencesState>) => void,
    saved: () => void,
}
type Props = TorrentPreferencesState & {
    has_max_conns: boolean,
    has_max_conns_per_torrent: boolean,
    has_global_uploads: boolean,
    has_global_uploads_per_torrent: boolean,
};

type AllProps = DispatchProps & TorrentState;

const setPreferencesFromState = (preferences?: TorrentPreferencesState) : Partial<Props> => {
    return {
        ...preferences, 
        has_max_conns: (preferences?.max_connec ?? -1) !== -1,
        has_max_conns_per_torrent: (preferences?.max_connec_per_torrent ?? -1) !== -1,
        has_global_uploads: (preferences?.max_uploads ?? -1) !== -1,
        has_global_uploads_per_torrent: (preferences?.max_uploads_per_torrent ?? -1) !== -1
    };
}

const TorrentPreferencesPage: React.FC<AllProps> = ({sync, update, saved, error, loading, ...state}) => {
    const [preferences, setPreferences] = useState(setPreferencesFromState(state.preferences));
    const [errors, setErrors] = useState(error);

    const navigate = useNavigate();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!formIsValid()) {
            toast.error("Preferences not updated");
            return;
        }
        update(preferences);
    }

    const formIsValid = () : boolean => {
        const { listen_port, max_uploads } = preferences;
        let validationError = "";

        if ((listen_port ?? -1) < 1) { validationError = "Make listen_port > 0"; } 
        if ((max_uploads ?? -1) < 1) { validationError = "Make global upload slots > 0"; } 

        setErrors(validationError);

        return validationError.length === 0;
    }

    const useRandomPort = () => {
        setPreferences({...preferences, listen_port: Math.floor(Math.random() * 65535)});
    }

    const handleChange = ({ target }: ChangeEvent<HTMLInputElement>, prop: keyof Props) => {
        if (target.type === "checkbox") {
            setPreferences({...preferences, [prop]: target.checked});
        } else if (target.type === "number") {
            setPreferences({...preferences, [prop]: parseInt(target.value, 10)});
        }
    }

    const formatNumber = (input?: number) : number => {
        if (input === -1) { return 1; }

        return input ?? 1;
    }

    const formatBoolean = (input?: boolean) : boolean => {
        return input ?? false;
    }

    // load preferences from API
    useEffect(() => {  sync(); }, []);

    // set preferences from state
    useEffect(() => { 
        setPreferences(setPreferencesFromState(state.preferences));
    }, [state.preferences]);
    
    useEffect(() => {
        if (state.preferences?.saved) {
            saved();
            toast.success("Preferences updated");
            navigate("/");
        }
    });

    return (<>
        {errors && 
            <>
                <div className="alert alert-danger" role="alert">
                    <h3>Whoops!</h3>
                    {errors}
                </div>
            </>
         }
         {loading && 
            <>
                <p>Preferences are loading ... </p>
            </>
        }
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Listening Port</legend>
                <div className="mb-3 row g-2">
                    <div className="col-md">
                        <div className="form-floating">
                            <input type="number" min={-2} max={65535} onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "listen_port"  )} value={formatNumber(preferences.listen_port)} className="form-control" id="listeningPortNumber" placeholder="Suggest making it > 8900" />
                            <label htmlFor="listeningPortNumber">Port used for incoming connections</label>
                        </div>
                    </div>
                    <div className="mb-3 col-md">
                        <button type="button" onClick={useRandomPort} className="btn btn-primary">Random</button>
                    </div>
                </div>
                <div className="mb-3 form-check">
                    <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "upnp"  )} className="form-check-input" checked={formatBoolean(preferences.upnp)} type="checkbox" id="useNatOrUpnp" />
                    <label className="form-check-label" htmlFor="useNatOrUpnp">
                        Use UPnP / NAT-PMP port forwarding from my router
                    </label>
                </div>
                <div className="mb-3 form-check">
                    <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "random_port"  )} className="form-check-input" checked={formatBoolean(preferences.random_port)} type="checkbox" value="" id="useDiffPortStartup" />
                    <label className="form-check-label" htmlFor="useDiffPortStartup">
                        Use different port on each startup
                    </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>Connection Limits</legend>
                <div className="mb-3 row g-2">
                    <div className="col-6">
                        <div className="form-check">
                            <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "has_max_conns"  )} className="form-check-input" checked={formatBoolean(preferences.has_max_conns)} type="checkbox" id="globalNumberConnections" />
                            <label className="form-check-label" htmlFor="globalNumberConnections">
                                Global maximum number of connections:
                            </label>
                        </div>
                    </div>
                    <div className={"col-2"}>
                        <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "max_connec"  )} type="number" min={1} className="form-control" disabled={!preferences.has_max_conns} value={!preferences.has_max_conns ? "" : formatNumber(preferences.max_connec)} id="numberGlobalNumberConnections" />
                        <label htmlFor="numberGlobalNumberConnections" className="visually-hidden">Enter global maximum number of connections</label>
                    </div>
                </div>
                <div className="mb-3 row g-2">
                    <div className="col-6">
                        <div className="form-check">
                            <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "has_max_conns_per_torrent"  )} className="form-check-input" type="checkbox" checked={formatBoolean(preferences.has_max_conns_per_torrent)} id="numberConnectionsPerTorrent" />
                            <label className="form-check-label" htmlFor="numberConnectionsPerTorrent">
                                Maximum number of connections per torrent
                            </label>
                        </div>
                    </div>
                    <div className="col-2">
                        <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "max_connec_per_torrent"  )} type="number" min={1} className="form-control" disabled={!preferences.has_max_conns_per_torrent} value={!preferences.has_max_conns_per_torrent ? "" : formatNumber(preferences.max_connec_per_torrent)} id="numberConnectionsPerTorrent" />
                        <label htmlFor="numberConnectionsPerTorrent" className="visually-hidden">Enter maximum number of connections per torrent</label>
                    </div>
                </div>
                <div className="mb-3 row g-2">
                    <div className="col-6">
                        <div className="form-check">
                            <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "has_global_uploads"  )} className="form-check-input" type="checkbox" checked={formatBoolean(preferences.has_global_uploads)} id="globalUploadSpots" />
                            <label className="form-check-label" htmlFor="globalUploadSpots">
                                Global maximum number of upload slots
                            </label>
                        </div>
                    </div>
                    <div className="col-2">
                        <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "max_uploads"  )} type="number" min={-2} className="form-control" disabled={!preferences.has_global_uploads} value={!preferences.has_global_uploads ? "" : formatNumber(preferences.max_uploads)} id="numberGlobalUploadSpots" />
                        <label htmlFor="numberGlobalUploadSpots" className="visually-hidden">Enter global maximum number of upload slots</label>
                    </div>
                </div>
                <div className="mb-3 row g-2">
                    <div className="col-6">
                        <div className="form-check">
                            <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "has_global_uploads_per_torrent"  )} className="form-check-input" type="checkbox" checked={formatBoolean(preferences.has_global_uploads_per_torrent)} id="uploadSlotsPerTorrent" />
                            <label className="form-check-label" htmlFor="uploadSlotsPerTorrent">
                                Maximum number of upload slots per torrent
                            </label>
                        </div>
                    </div>
                    <div className="col-2">
                        <input onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event, "max_uploads_per_torrent"  )} type="number" min={1} className="form-control" disabled={!preferences.has_global_uploads_per_torrent} value={!preferences.has_global_uploads_per_torrent ? "" : formatNumber(preferences.max_uploads_per_torrent)} id="numberUploadSlotsPerTorrent" />
                        <label htmlFor="numberUploadSlotsPerTorrent" className="visually-hidden">Enter maximum number of upload slots per torrent</label>
                    </div>
                </div>
            </fieldset>

            <button type="submit" className="btn btn-primary">Save</button>
        </form>
    </>)
}

const mapDispatchToProps = (dispatch: ThunkDispatch<TorrentState, Record<string, never>, AnyAction>): DispatchProps => {
    return {
      sync: async () => {
        await dispatch(torrentActions.loadPreferences());
      },
      update: async (preferences: Partial<Props>) => {
          await dispatch(torrentActions.updatePreferences(preferences));
      },
      saved: () => {
          dispatch(torrentActions.savePreferencesDone());
      }
    }
  }

const mapStateToProps = (state: ApplicationState) : TorrentState => state.torrent;

export default connect(mapStateToProps, mapDispatchToProps)(TorrentPreferencesPage);