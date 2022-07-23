import React from "react";
import {TorrentPreferencesPage} from './TorrentPreferences';
import {mainData, preferences} from '../../../tools/mockData.js';
import {QBittorrentTorrentInfo} from '../../api/qbitorrent/types/QBittorrentTorrentsMethods';
import { mount, shallow } from "enzyme";
import { MemoryRouter } from "react-router-dom";

jest.mock('react-router', () => ({
    ...jest.requireActual("react-router"), useNavigate: () => jest.fn()
}));

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
    return <TorrentPreferencesPage { ...props } />;
}

it('renders form and fieldsets', () => {
    const wrapper = shallow(renderTorrentPreferences());
    expect(wrapper.find('form').length).toBe(1);
    expect(wrapper.find('fieldset').length).toBe(2);
});

it('shows loading message when preferences loading', () => {
    const wrapper = mount(<MemoryRouter>{renderTorrentPreferences({loading: true})}</MemoryRouter>);
    expect(wrapper.find('.alert.alert-info').length).toBe(1);
    expect(wrapper.find('.alert.alert-info').text()).toBe("Preferences are loading ...");
});