import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import Slider from 'react-slick';
import {
    Container,
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Button,
    IconButton,
    Rating,
    TextField,
} from '@mui/material';
import { AuthContext } from './AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/ShowSpot.css';

const api = import.meta.env.VITE_BACKEND_URL || '/api'; 
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const ShowSpot = () => {
    const { id } = useParams(); // Extract 'id' from the URL
    const navigate = useNavigate();
    const [spot, setSpot] = useState(null);
    const { isAuthenticated, username } = useContext(AuthContext);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');

    useEffect(() => {
        const fetchSpot = async () => {
            try {
                const response = await axios.get(`${api}/spotgrounds/${id}`, {withCredentials: true});
                setSpot(response.data);
            } catch (error) {
                console.error('Error fetching spot:', error);
                navigate('/posts', { state: { message: 'Post not found. Try again later.', type: 'error' } });
            }
        };

        fetchSpot();
    }, [id, navigate]);

    useEffect(() => {
        if (spot) {
            const map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/light-v11',
                center: spot.geometry.coordinates,
                zoom: 10
            });

            map.addControl(new mapboxgl.NavigationControl());

            new mapboxgl.Marker()
                .setLngLat(spot.geometry.coordinates)
                .setPopup(
                    new mapboxgl.Popup({ offset: 25 })
                        .setHTML(`<h6>${spot.title}</h6><p>${spot.location}</p>`)
                )
                .addTo(map);
        }
    }, [spot]);

    const handleReviewSubmit = async () => {
        try {
            const reviewData = {
                review: {
                    rating: reviewRating,
                    body: reviewText,
                },
            };
            await axios.post(`${api}/spotgrounds/${id}/reviews`, reviewData);
            setReviewRating(0);
            setReviewText('');
            const updatedSpot = await axios.get(`${api}/spotgrounds/${id}`);
            setSpot(updatedSpot.data);
        } catch (error) {
            console.error('Error submitting review:', error.response || error.message);
            // Optionally, show user-friendly error message
            alert('Failed to submit review. Please try again.');
        }
    };



    const handleReviewDelete = async (reviewId) => {
       
        try {

            // Send delete request
            const response = await axios.delete(`${api}/spotgrounds/${id}/reviews/${reviewId}`);

            if (response.status === 200) {
                console.log('Review deleted successfully:', response.data);
                const updatedSpot = await axios.get(`/${api}/spotgrounds/${id}`);
                setSpot(updatedSpot.data);
                
            } else {
                console.error('Failed to delete review:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };



    const handleDeleteSpot = async () => {
        if (!isAuthenticated) {
            alert('You must be logged in to delete this spot.');
            return;
        }

        try {
            await axios.delete(`${api}/spotgrounds/${id}`);
            navigate('/posts', { state: { message: 'Delete Successful', type: 'success' } });
        } catch (error) {
            console.error('Error deleting spot:', error.response || error.message);
            // Optionally, show user-friendly error message
            alert('Failed to delete spot. Please try again.');
        }
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    if (!spot) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div className="show-spot-background">
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card className="content-card">
                            {spot.thumbnail.length > 1 ? (
                                <Slider {...sliderSettings}>
                                    {spot.thumbnail.map((image, index) => (
                                        <CardMedia
                                            key={index}
                                            component="img"
                                            height="400"
                                            image={image.url || 'https://res.cloudinary.com/djgibqxxv/image/upload/v1697057877/wiwcjtc0dcxzxqhhsiai.jpg'}
                                            alt={spot.title}
                                        />
                                    ))}
                                </Slider>
                            ) : (
                                <CardMedia
                                    component="img"
                                    height="400"
                                    image={spot.thumbnail[0]?.url || 'https://res.cloudinary.com/djgibqxxv/image/upload/v1697057877/wiwcjtc0dcxzxqhhsiai.jpg'}
                                    alt={spot.title}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h4" gutterBottom>
                                    {spot.title}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {spot.description}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Location: {spot.location}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Price: ${spot.price}/Night
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Submitted by: {spot.author.username}
                                </Typography>
                            </CardContent>
                        </Card>
                        {isAuthenticated && username === spot.author.username && (
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    style={{backgroundColor:'#000'}}
                                    startIcon={<EditIcon />}
                                    onClick={() => navigate(`/posts/${id}/edit`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{backgroundColor:'#000'}}
                                    startIcon={<DeleteIcon />}
                                    sx={{ ml: 2 }}
                                    onClick={handleDeleteSpot}
                                >
                                    Delete
                                </Button>
                            </Box>
                        )}
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box mb={4}>
                            <div id="map" className="map-container" />
                        </Box>
                        <Box className="reviewBox"
                            sx={{
                                backgroundColor: '#ffffff',
                                borderRadius: '10px',
                                padding: '16px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                marginTop: '16px'
                            }}>
                            <Typography variant="h6" gutterBottom>
                                Reviews
                            </Typography>
                            {isAuthenticated && (
                                <Box mb={3}>
                                    <Typography variant="subtitle1">Leave a Review</Typography>
                                    <Rating
                                        name="review-rating"
                                        value={reviewRating}
                                        onChange={(event, newValue) => setReviewRating(newValue)}
                                    />
                                    <TextField
                                        placeholder="Write your review..."
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        sx={{ mt: 2 }}
                                    />
                                    <Button
                                        variant="contained"
                                        style={{backgroundColor:'#000'}}
                                        sx={{ mt: 1 }}
                                        onClick={handleReviewSubmit}
                                    >
                                        Submit
                                    </Button>
                                </Box>
                            )}
                            {spot.reviews.map((review) => (
                                <Card key={review._id} className="review-card" sx={{ position: 'relative' }}>
                                    <CardContent>
                                        <Typography variant="subtitle1" gutterBottom>
                                            By: {review.author.username}
                                        </Typography>
                                        <Rating name="review-rating" value={review.rating} readOnly />
                                        <Typography variant="body2" color="textSecondary">
                                            {review.body}
                                        </Typography>
                                        {isAuthenticated && username === review.author.username && (
                                            <IconButton
                                                color="error"
                                                onClick={() => handleReviewDelete(review._id)}
                                                className="delete-button"
                                                sx={{ position: 'absolute', bottom: 8, right: 8 }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default ShowSpot;
