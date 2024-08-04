import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Button, Grid, CardMedia } from '@mui/material';

const SpotList = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const response = await axios.get('/spotgrounds/');
                setSpots(response.data);
            } catch (error) {
                console.error('Error fetching spots:', error);
            }
        };

        fetchSpots();
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Spotgrounds
            </Typography>
            <Grid container spacing={3}>
                {spots.map(spot => (
                    <Grid item xs={12} sm={6} md={4} key={spot._id}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="140"
                                image={spot.thumbnail.length ? spot.thumbnail[0].url : "https://res.cloudinary.com/djgibqxxv/image/upload/v1697057877/wiwcjtc0dcxzxqhhsiai.jpg"}
                                alt={spot.title}
                            />
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {spot.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {spot.description}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {spot.location}
                                </Typography>
                                <Button variant="contained" color="primary" href={`/spotgrounds/${spot._id}`}>
                                    View
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default SpotList;
