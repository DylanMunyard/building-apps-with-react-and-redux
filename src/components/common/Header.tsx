import React from 'react';
import { NavLink } from 'react-router-dom';
import HeaderIcon from "./header-icon.png";

const Header: React.FC = () => {
    function navStyle({ isActive } : { isActive: boolean }) {
        return "nav-link" + (isActive ? " active" : "");
    }
    return (
        <nav className="navbar navbar-expand-lg bg-light navbar-light">
            <div className="container-fluid">
                <NavLink to="/" className={({ isActive } : { isActive: boolean }) => navStyle({ isActive }) + " navbar-brand"}>
                    <img src={HeaderIcon} alt="Home" width="32" height="32" />
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/torrentpreferences" className={navStyle}>Preferences</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/about" className={navStyle}>About</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;