import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/NavBar.css';
import { AuthContext } from './AuthContext';
import axios from 'axios';

const NavBar = () => {
    const { isAuthenticated, username, setIsAuthenticated, setUsername } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.get('/api/logout', { withCredentials: true });
            setIsAuthenticated(false);
            setUsername('');
            localStorage.removeItem('username');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-links">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/posts">Posts</Link>
                    <Link className="nav-link" to="/posts/new">Create a Post</Link>
                </div>

                {isAuthenticated ? (
                    <div className='navbar-auth'>
                        <Link className="nav-link">{username}</Link>
                        <Link className="nav-link" onClick={handleLogout}>Log Out</Link>
                    </div>
                ) : (
                    <div className="navbar-auth">
                        <Link className="nav-link" to="/login">Login</Link>
                        <Link className="nav-link" to="/signup">Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
