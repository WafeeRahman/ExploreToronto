import React from 'react';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import '../styles/HomePage.css';
import { Button } from '@mui/material';
import FlashMessage from './FlashMessage';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
const HomePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const [flashMessage, setFlashMessage] = useState({ message: '', type: '' });

    useEffect(() => {
        // Check if there is a state passed from the previous navigation
        if (location.state && location.state.message) {
            setFlashMessage({ message: location.state.message, type: location.state.type });
        }
    }, [location.state]);

    const handleCloseFlashMessage = () => {
        setFlashMessage({ message: '', type: '' });
    };

    
    
    return (
        
        <motion.div
            className="homepage"
            transition={{ duration: 1.5 }}
        >
            <FlashMessage
                message={flashMessage.message}
                type={flashMessage.type}
                onClose={handleCloseFlashMessage}
            />

            <motion.div
                className="color-overlay"
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ type: 'tween', duration: 1, ease: 'easeInOut', opacity: { delay: 2, duration: 1 } }}
                style={{ originX: 0, backgroundColor: '#FEFCFB', height: '100vh', position: 'absolute', width: '100%', zIndex: 2 }}
            />
            <motion.div
                className="color-overlay"
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{ type: 'tween', duration: 1.5, ease: 'easeInOut', opacity: { delay: 2.5, duration: 1 } }}
                style={{ originX: 1, backgroundColor: '#001F54', height: '100vh', position: 'absolute', width: '100%', zIndex: 2 }}
            />
            <div className="homepage-content">
                <img
                    className="homepage-image"
                    src="https://res.cloudinary.com/djgibqxxv/image/upload/v1697074244/Hang/qo2xtoi31i6qlptzcfma.jpg"
                    alt="Hoopify Background"
                />
                <motion.div
                    className="homepage-text"
                    initial={{ x: '-100%', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'tween', duration: 2, ease: 'easeInOut' }}
                    style={{ zIndex: 3 }}
                >
                    <h1>Explore Toronto</h1>
                    <p>Your Guide for Tourism</p>
                </motion.div>
                <motion.div
                    className="homepage-button"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', duration: 1, delay: 2 }}
                    style={{ zIndex: 3 }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ backgroundColor: '#F8F7FF', color: '#000' }}
                        onClick={() => navigate('/posts')}
                    >
                        Explore Posts
                    </Button>
                </motion.div>
            </div>
            <footer className="homepage-footer">© 2024 Hoopify</footer>
        </motion.div>
    );
};

export default HomePage;
