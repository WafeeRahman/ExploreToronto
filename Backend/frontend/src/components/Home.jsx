import React from 'react';
import { motion } from 'framer-motion';
import NavBar from './NavBar';
import '../HomePage.css';

const HomePage = () => {
    return (
        <div className="homepage">
            <NavBar />
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
                >
                    <h1>Hoopify</h1>
                    <p>Your Ultimate Basketball Hub</p>
                </motion.div>
            </div>
            <footer className="homepage-footer">© 2024 Hoopify</footer>
        </div>
    );
};

export default HomePage;
