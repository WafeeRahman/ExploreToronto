import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
    Card,
    CardMedia,
    CardActions,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import '../styles/CreateEdit.css'
const api = import.meta.env.VITE_BACKEND_URL || '/api'; 
const EditSpot = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formValues, setFormValues] = useState({
        title: '',
        location: '',
        description: '',
        price: '',
        thumbnail: [], // URLs for existing images
    });
    const [flashMessage, setFlashMessage] = useState({ open: false, message: '', severity: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [filesToDelete, setFilesToDelete] = useState([]);
    const [newFiles, setNewFiles] = useState([]);

    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                const response = await axios.get(`${api}/spotgrounds/${id}`, {withCredentials: true});
                const post = response.data;
                setFormValues({
                    title: post.title,
                    location: post.location,
                    description: post.description,
                    price: post.price,
                    thumbnail: post.thumbnail, // Existing image URLs
                });

                const username = localStorage.getItem('username');
                if (post.author.username !== username) {
                    navigate('/home', { state: { message: 'Unauthorized Action. Log In and Try Again.', type: 'error' } });
                    setFlashMessage({ open: true, message: 'Unauthorized access!', severity: 'error' });
                }
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching post details:', error);
                setFlashMessage({ open: true, message: 'Failed to fetch post details.', severity: 'error' });
            }
        };

        fetchPostDetails();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleFileChange = (e) => {
        setNewFiles(e.target.files);
    };

    const handleDeleteThumbnail = (filename) => {
        setFilesToDelete(prev => {
            if (prev.includes(filename)) {
                return prev.filter(file => file !== filename);
            } else {
                return [...prev, filename];
            }
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('spotgrounds[title]', formValues.title);
            formData.append('spotgrounds[location]', formValues.location);
            formData.append('spotgrounds[description]', formValues.description);
            formData.append('spotgrounds[price]', formValues.price);

            // Append new files
            Array.from(newFiles).forEach(file => {
                formData.append('thumbnail', file);
            });

            // Append files to delete
            filesToDelete.forEach(filename => {
                formData.append('deleteImages[]', filename);
            });

            // Debugging information
            console.log('FormData contents:');
            for (let pair of formData.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            await axios.put(`${api}/spotgrounds/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true  
            });

            setFlashMessage({ open: true, message: 'Spot updated successfully!', severity: 'success' });
            navigate(`/posts/${id}`, { state: { message: 'Spot updated successfully!', type: 'success' } });

        } catch (error) {
            console.error('Error updating spot:', error);
            setFlashMessage({ open: true, message: 'Failed to update spot.', severity: 'error' });
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="page-content">
             <div className="full-page-container"></div>
            <Container className="container" maxWidth="sm" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
                    Edit Post
                </Typography>
                <form onSubmit={handleFormSubmit} encType="multipart/form-data">
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
                                InputProps={{ startAdornment: <span>$</span> }}
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
                                <Button variant="contained" component="span">
                                    Update Images
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Existing Images
                            </Typography>
                            <Box display="flex" flexWrap="wrap" gap={2}>
                                {formValues.thumbnail.map((thmb, i) => (
                                    <Card key={i} sx={{ maxWidth: 345 }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={thmb.url}
                                            alt="Thumbnail"
                                        />
                                        <CardActions>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={filesToDelete.includes(thmb.filename)}
                                                        onChange={() => handleDeleteThumbnail(thmb.filename)}
                                                    />
                                                }
                                                label="Delete"
                                            />
                                        </CardActions>
                                    </Card>
                                ))}
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="center" gap={2}>
                                <Button type="submit" variant="contained">
                                    Save Changes
                                </Button>
                                <Button variant="contained" onClick={() => navigate(`/posts/${id}`)}>
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

export default EditSpot;
