import React from "react";
import {Route, Routes} from "react-router-dom";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";
import TorrentList from "./torrents/TorrentList";
import TorrentPreferences from "./torrents/TorrentPreferences";

const App: React.FC = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <Header />
                <Routes>
                    <Route path="/" element={<TorrentList />} />
                    <Route path="/torrentpreferences" element={<TorrentPreferences />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </div>
        </div>
    )
}

export default App;