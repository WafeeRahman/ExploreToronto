import React, { useEffect, useState } from 'react';
import '../styles/LoadingOverlay.css'; // Ensure this path matches your setup

const LoadingOverlay = () => {
    const [isAnimating, setIsAnimating] = useState(true);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAnimating(false);
            const hideTimer = setTimeout(() => setIsHidden(true), 1000); // Delay to match the fade-out duration
            return () => clearTimeout(hideTimer);
        }, 1500); // Duration of the animation

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`loading-overlay ${isHidden ? 'hidden' : ''}`}>
            <div className={`overlay-animation ${isAnimating ? 'expand' : 'shrink'}`}>
                <span className={`loading-overlay ${isHidden ? 'hidden' : ''}`}>EXPLORE TORONTO</span>
            </div>

        </div>
    );
};

export default LoadingOverlay;
