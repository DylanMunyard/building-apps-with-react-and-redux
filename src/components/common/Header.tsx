import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
    function navStyle({ isActive } : { isActive: boolean }) {
        return isActive ? "btn btn-primary" : "btn";
    }
    return (
        <nav>
        <NavLink to="/" className={navStyle}>Home</NavLink>{" | "}
            <NavLink to="/torrentpreferences" className={navStyle}>Preferences</NavLink>{" | "}
            <NavLink to="/about" className={navStyle}>About</NavLink>
        </nav>
    );
}

export default Header;