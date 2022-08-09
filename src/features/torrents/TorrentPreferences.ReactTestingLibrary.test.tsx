import React from "react";
import { render } from "@testing-library/react";
import {TorrentPreferencesPage} from './TorrentPreferences';
import {mainData, preferences} from '../../../tools/mockData.js';
import {QBittorrentTorrentInfo} from '../../api/qbitorrent/types/QBittorrentTorrentsMethods';
import { MemoryRouter } from "react-router-dom";

const renderTorrentPreferences = (args: {[key: string]: unknown} = {}) => {
    const torrents : {
        [hash: string]: QBittorrentTorrentInfo;
    } = {};
    
    Object.keys(mainData.torrents).forEach((torrent) => {
        torrents[torrent] = {
            ...torrents[torrent]
        };
    });

    const defaultProps = {
        error: "",
        loading: false,
        torrents,
        preferences: {...preferences, saved: false},
        sync: jest.fn(),
        update: jest.fn(),
        saved: jest.fn()
    };

    const props = { ...defaultProps, ...args };
    return render(<MemoryRouter><TorrentPreferencesPage { ...props } /></MemoryRouter>);
}

it("should render Save button", () => {
    const { getByText } = renderTorrentPreferences();
    getByText("Save");
});

it("should render listening port help test", () => {
    const { getByText } = renderTorrentPreferences();
    getByText("Port used for incoming connections");
});