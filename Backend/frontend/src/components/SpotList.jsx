import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { Card, CardContent, Typography, Button, Grid, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import '../styles/SpotList.css'; // Ensure this path is correct
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import FlashMessage from './FlashMessage';
import { useLocation } from 'react-router-dom';
import LoadingOverlay from './LoadingOverlay'; // Import the loading overlay component

const api = import.meta.env.VITE_BACKEND_URL || '/api'; // Default to proxy during development
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const SpotList = () => {
    const location = useLocation();
    const { state } = location;
    const [spots, setSpots] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false); // State to track map loading
    const navigate = useNavigate();
    const [flashMessage, setFlashMessage] = useState({ message: '', type: '' });
    const [mapInstance, setMapInstance] = useState(null); // State to keep track of the map instance

    useEffect(() => {
        if (location.state && location.state.message) {
            setFlashMessage({ message: location.state.message, type: location.state.type });
        }
    }, [location.state]);

    const handleCloseFlashMessage = () => {
        setFlashMessage({ message: '', type: '' });
    };

    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const response = await axios.get(`${api}/spotgrounds/`, { withCredentials: true });
                setSpots(response.data);
                setIsLoaded(true);
            } catch (error) {
                console.error('Error fetching spots:', error);
                navigate('/', { state: { message: 'Database Failure, Try Again Later.', type: 'error' } });
            }
        };

        fetchSpots();
    }, [navigate]);

    useEffect(() => {
        if (isLoaded) {
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.innerHTML = ''; // Clear previous map if any

                // Set a timeout to ensure map is rendered properly
                setTimeout(() => {
                    const map = new mapboxgl.Map({
                        container: 'map',
                        style: 'mapbox://styles/mapbox/light-v11',
                        center: [-79.3832, 43.651070],
                        zoom: 11
                    });

                    map.addControl(new mapboxgl.NavigationControl());

                    map.on('load', () => {
                        map.addSource('Spots', {
                            type: 'geojson',
                            data: {
                                type: 'FeatureCollection',
                                features: spots.map(spot => ({
                                    type: 'Feature',
                                    properties: {
                                        popUpMarkup: `<h3>${spot.title}</h3><p>${spot.description}</p>`
                                    },
                                    geometry: spot.geometry
                                }))
                            },
                            cluster: true,
                            clusterMaxZoom: 14,
                            clusterRadius: 50
                        });

                        map.addLayer({
                            id: 'clusters',
                            type: 'circle',
                            source: 'Spots',
                            filter: ['has', 'point_count'],
                            paint: {
                                'circle-color': [
                                    'step',
                                    ['get', 'point_count'],
                                    '#F7D08A',
                                    100,
                                    '#F7D08A',
                                    750,
                                    '#F7D08A'
                                ],
                                'circle-radius': [
                                    'step',
                                    ['get', 'point_count'],
                                    15,
                                    25,
                                    20,
                                    50,
                                    25
                                ]
                            }
                        });

                        map.addLayer({
                            id: 'cluster-count',
                            type: 'symbol',
                            source: 'Spots',
                            filter: ['has', 'point_count'],
                            layout: {
                                'text-field': ['get', 'point_count_abbreviated'],
                                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                                'text-size': 12
                            }
                        });

                        map.addLayer({
                            id: 'unclustered-point',
                            type: 'circle',
                            source: 'Spots',
                            filter: ['!', ['has', 'point_count']],
                            paint: {
                                'circle-color': '#F7D08A',
                                'circle-radius': 4,
                                'circle-stroke-width': 1,
                                'circle-stroke-color': '#fff'
                            }
                        });

                        map.on('click', 'clusters', (e) => {
                            const features = map.queryRenderedFeatures(e.point, {
                                layers: ['clusters']
                            });
                            const clusterId = features[0].properties.cluster_id;
                            map.getSource('Spots').getClusterExpansionZoom(
                                clusterId,
                                (err, zoom) => {
                                    if (err) return;

                                    map.easeTo({
                                        center: features[0].geometry.coordinates,
                                        zoom: zoom
                                    });
                                }
                            );
                        });

                        map.on('click', 'unclustered-point', (e) => {
                            const text = e.features[0].properties.popUpMarkup;
                            const coordinates = e.features[0].geometry.coordinates.slice();

                            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                            }

                            new mapboxgl.Popup()
                                .setLngLat(coordinates)
                                .setHTML(text)
                                .addTo(map);
                        });

                        map.on('mouseenter', 'clusters', () => {
                            map.getCanvas().style.cursor = 'pointer';
                        });
                        map.on('mouseleave', 'clusters', () => {
                            map.getCanvas().style.cursor = '';
                        });

                        setMapLoaded(true); // Mark map as loaded
                        setMapInstance(map); // Store the map instance
                    });
                }, 2000); // Adjust timeout duration if needed

            }
        }
    }, [isLoaded, spots, navigate]);

    useEffect(() => {
        // Ensure the map resizes correctly when the container's size changes
        const handleResize = () => {
            if (mapInstance) {
                mapInstance.resize();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [mapInstance]);

    return (
        <div className="spotlist-container">
            <LoadingOverlay isLoading={!mapLoaded} /> {/* Show loading overlay when map is not loaded */}

            <FlashMessage
                message={flashMessage.message}
                type={flashMessage.type}
                onClose={handleCloseFlashMessage}
            />

            <motion.div
                className="map-wrapper"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 1, delay: 2 }}
            >
                <div id='map' className="map-container" />
            </motion.div>

            <motion.div
                className="create-button-container"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 1 }}
            >
                <Button
                    className="create-button"
                    variant="contained"
                    onClick={() => navigate('/posts/new')}
                >
                    Create Post
                </Button>
            </motion.div>

            <Grid container direction="column" spacing={3} justifyContent="center">
                {spots.map(spot => (
                    <Grid item xs={12} sm={10} md={8} lg={6} key={spot._id}>
                        <Card className="spotlist-card">
                            <Grid container>
                                <Grid item xs={4}>
                                    <CardMedia
                                        component="img"
                                        image={spot.thumbnail.length ? spot.thumbnail[0].url : "https://res.cloudinary.com/djgibqxxv/image/upload/v1697057877/wiwcjtc0dcxzxqhhsiai.jpg"}
                                        alt={spot.title}
                                        className="spotlist-thumbnail"
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {spot.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {spot.location}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {spot.description}
                                        </Typography>
                                        <div className="view-button">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => navigate(`/posts/${spot._id}`)}
                                                style={{ marginTop: '10%', backgroundColor: '#000' }}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Card>
                        <br />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default SpotList;
