import React from "react";
import { MemoryRouter } from "react-router-dom";
import renderer, { act } from "react-test-renderer";
import {TorrentPreferencesPage} from './TorrentPreferences';
import {mainData, preferences} from '../../../tools/mockData.js';
import {QBittorrentTorrentInfo} from '../../api/qbitorrent/types/QBittorrentTorrentsMethods';

it("sets submit button label 'Saving...' when saving is true", () => {
    const torrents : {
        [hash: string]: QBittorrentTorrentInfo;
    } = {};
    
    Object.keys(mainData.torrents).forEach((torrent) => {
        torrents[torrent] = {
            ...torrents[torrent]
        };
    });
    const tree = renderer.create(
        <MemoryRouter>
            <TorrentPreferencesPage
                error=""
                loading={false}
                torrents={torrents}
                preferences={{...preferences, saved: false}}
                sync={jest.fn()}
                update={jest.fn()}
                saved={jest.fn()}
            />
        </MemoryRouter>
    );

    expect(tree).toMatchSnapshot();
});