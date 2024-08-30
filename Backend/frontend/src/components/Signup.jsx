import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { TextField, Button, Container, Box, Typography } from '@mui/material';
import NavBar from './NavBar';
import '../styles/LoginSignup.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import FlashMessage from './FlashMessage';

import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const api = import.meta.env.VITE_BACKEND_URL || '/api'; 
const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
    });

    const navigate = useNavigate(); // Call useNavigate inside the component

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


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${api}/register`, formData);
            if (response.data.success) {
                navigate('/login', { state: { message: 'Registration Successful', type: 'success' } });
            } else {
                setFlashMessage({ message: response.data.message, type: 'error' });
            }
        } catch (error) {
            setFlashMessage({ message: 'Sign Up Failed. Please try again.', type: 'error' });
        }
    };




    return (
        <div>

            <FlashMessage
                message={flashMessage.message}
                type={flashMessage.type}
                onClose={handleCloseFlashMessage}
            /> <FlashMessage/>
            <motion.div
                className="signup-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}
            >
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
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ type: 'tween', duration: 1.5, ease: 'easeInOut', opacity: { delay: 2.5, duration: 1 } }}
                    style={{ originX: 1, backgroundColor: '#001F54', height: '100vh', position: 'absolute', width: '100%', zIndex: 2 }}
                />
                <img
                    className="signup-image"
                    src="https://res.cloudinary.com/djgibqxxv/image/upload/v1697074244/Hang/qo2xtoi31i6qlptzcfma.jpg"
                    alt="Background"
                    style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        zIndex: 1,
                        opacity: 0.7,
                    }}
                />
                <Container
                    maxWidth="sm"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        zIndex: 3,
                        position: 'relative',
                    }}
                >
                    <Box
                        className="login-card"
                        sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: 3,
                            textAlign: 'center',
                            transition: 'background-color 0.3s ease',
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Sign Up
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Username"
                                name="username"
                                variant="outlined"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Email"
                                name="email"
                                variant="outlined"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                name="password"
                                type="password"
                                variant="outlined"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                className="signup-button"
                                style={{
                                    marginTop: 16,
                                    backgroundColor: '#001F54',
                                    color: '#F8F7FF',
                                    padding: '12px 0',
                                }}
                            >
                                Sign Up
                            </Button>
                        </form>
                    </Box>
                </Container>
            </motion.div>
        </div>
    );
};

export default Signup;
