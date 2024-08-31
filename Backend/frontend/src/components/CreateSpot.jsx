import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
} from '@mui/material';
import '../styles/CreateEdit.css'; // Import the CSS file
const api = import.meta.env.VITE_BACKEND_URL || '/api';
const CreateSpot = () => {
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        title: '',
        location: '',
        description: '',
        price: '',
        thumbnail: [],
    });
    const [flashMessage, setFlashMessage] = useState({ open: false, message: '', severity: '' });
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(`${api}/check-auth`, { withCredentials: true });
                if (response.data.isAuthenticated) {
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        username: response.data.username || ''
                    }));
                } else {
                    setFlashMessage({ open: true, message: 'You must be logged in to create a spot.', severity: 'error' });
                    navigate('/login', { state: { message: 'You Must Be Logged In to Create A Post', type: 'error' } });
                }
            } catch (error) {
                setFlashMessage({ open: true, message: 'Authentication check failed. Please log in again.', severity: 'error' });
                navigate('/login', { state: { message: 'Authentication check failed. Please log in again.', type: 'error' } });
            }
        };
    
        checkAuth();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormValues({ ...formValues, thumbnail: e.target.files });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', formValues.title);
            formData.append('location', formValues.location);
            formData.append('description', formValues.description);
            formData.append('price', formValues.price);
    
            for (let i = 0; i < formValues.thumbnail.length; i++) {
                formData.append('thumbnail', formValues.thumbnail[i]);
            }
    
            const response = await axios.post(`${api}/spotgrounds/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
    
            const newSpotId = response.data._id;
            setFlashMessage({ open: true, message: 'Spot created successfully!', severity: 'success' });
            navigate(`/posts/${newSpotId}`);
        } catch (error) {
            setFlashMessage({ open: true, message: 'Error in Creation Process. Please Try Again', severity: 'error' });
            console.error('Error creating spot:', error);
        }
    };
    

    return (
        <div className="page-content">
            <div className="full-page-container"></div>

            <Container
                className="container pop-in"
                maxWidth="sm"
                sx={{ mt: 4 }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    align="center"
                    sx={{ mb: 4 }}
                >
                    Create a New Post
                </Typography>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formValues.title}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Location"
                                name="location"
                                value={formValues.location}
                                onChange={handleInputChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                value={formValues.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={formValues.price}
                                onChange={handleInputChange}
                                required
                                InputProps={{
                                    startAdornment: <span>$</span>,
                                    style: { color: '#000' },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <input
                                type="file"
                                id="thumbnail"
                                name="thumbnail"
                                multiple
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="thumbnail">
                                <Button
                                    variant="contained"
                                    component="span"
                                    className="button"
                                    style={{ backgroundColor: '#000' }}
                                >
                                    Add Images
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center" gap={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="button button-primary"
                                >
                                    Add Spot
                                </Button>
                                <Button
                                    variant="contained"
                                    className="button button-secondary"
                                    onClick={() => navigate('/posts')}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Container>
            <Snackbar
                open={flashMessage.open}
                autoHideDuration={6000}
                onClose={() => setFlashMessage({ ...flashMessage, open: false })}
            >
                <Alert onClose={() => setFlashMessage({ ...flashMessage, open: false })} severity={flashMessage.severity}>
                    {flashMessage.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CreateSpot;
