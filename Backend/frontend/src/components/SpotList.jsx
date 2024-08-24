import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import { Card, CardContent, Typography, Button, Grid, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import '../styles/SpotList.css';
import NavBar from './NavBar';
import { Navigate, useNavigate } from 'react-router-dom';
import FlashMessage from './FlashMessage';
import { useLocation } from 'react-router-dom';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const SpotList = () => {
    const [spots, setSpots] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchSpots = async () => {
            try {
                const response = await axios.get('/api/spotgrounds/');
                await setSpots(response.data);
                console.log(spots);


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
                                features: response.data.map(spot => ({
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
                    });


                }, 2500);
            } catch (error) {
                console.error('Error fetching spots:', error);
                navigate('/', { state: { message: 'Database Failure, Try Again Later.', type: 'error' } });
            }


        };

        fetchSpots();
    }, []);

    return (
        <div className="spotlist-container">

            <div></div>


            <motion.div
                id='map'
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 1, delay: 2 }}
                style={{ backgroundColor: '#FEFCFB', marginTop: '5vh' }}
            >
                <div id='map' style={{ width: '70%', height: '500px', margin: 'auto', marginBottom: '5px', borderRadius: '10px', overflow: 'hidden', padding: '5rem' }} />
            </motion.div>




            {/* Spot list cards */}
            <Grid container direction="column" spacing={3} justifyContent="center">
                {spots.map(spot => (
                    <Grid item xs={12} sm={8} md={6} lg={8} key={spot._id}>
                        <Card className="spotlist-card">
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
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {spot.location}
                                </Typography>
                                <Typography></Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {spot.description}
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
