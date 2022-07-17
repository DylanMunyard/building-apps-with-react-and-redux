import React from "react";
import {TorrentPreferencesPage} from './TorrentPreferences';
import {mainData, preferences} from '../../../tools/mockData.js';
import {QBittorrentTorrentInfo} from '../../api/qbitorrent/types/QBittorrentTorrentsMethods';
import { mount } from "enzyme";
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
    return mount(<MemoryRouter><TorrentPreferencesPage { ...props } /></MemoryRouter>);
}

it('sets error when attempting to save an invalid listen port', () => {
    const wrapper = renderTorrentPreferences();

    // arrange: set listening port to an invalid port number
    const listen_port = wrapper.find("#listeningPortNumber").first();
    listen_port.simulate("change", { target: { type: "number", value: "-2" } });

    // act: submit the form
    wrapper.find("form").simulate("submit");

    // assert
    expect(wrapper.find('.alert.alert-danger').length).toBe(1); 
    const error = wrapper.find(".alert.alert-danger").getDOMNode<HTMLDivElement>();
    expect(error.textContent).toContain("Make listen_port > 0");
});