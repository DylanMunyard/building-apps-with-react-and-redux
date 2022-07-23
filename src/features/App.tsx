import React from "react";
import {Route, Routes} from "react-router-dom";
import AboutPage from "./about/AboutPage";
import Header from "../components/header";
import PageNotFound from "./PageNotFound";
import TorrentList from "./torrents/TorrentList";
import TorrentPage from "./torrents/TorrentPage";
import TorrentPreferences from "./torrents/TorrentPreferences";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
    return (
        <div className="container">
            <Header />
            <Routes>
                <Route path="/" element={<TorrentList />} />
                <Route path="/torrents/:id" element={<TorrentPage />} />
                <Route path="/torrents" element={<TorrentList />} />
                <Route path="/torrentpreferences" element={<TorrentPreferences />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <ToastContainer autoClose={3000} hideProgressBar />
        </div>
    )
}

export default App;