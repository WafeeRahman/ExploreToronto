import React from 'react';
import { Link } from 'react-router-dom';
import '../NavBar.css';

const NavBar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
              
                <div className="navbar-links">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/spotgrounds">Spots</Link>
                    <Link className="nav-link" to="/spotgrounds/new">Create a Spot</Link>
                </div>
                <div className="navbar-auth">
                    <Link className="nav-link" to="/login">Login</Link>
                    <Link className="nav-link" to="/signup">Sign Up</Link>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
