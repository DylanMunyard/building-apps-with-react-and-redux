import React from "react";
import {Route, Routes} from "react-router-dom";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";
import WeatherPage from "./weather/WeatherPage";
import TorrentPage from "./torrents/TorrentPage";

const App: React.FC = () => {
    return (
        <div className="container-fluid">
            <Header />
            <Routes>
                <Route path="/" element={<TorrentPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/weather" element={<WeatherPage />} />
                <Route path="/*" element={<PageNotFound />} />
            </Routes>
        </div>
    )
}

export default App;