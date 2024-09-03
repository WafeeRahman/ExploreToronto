# Explore Toronto

Explore Toronto is a full-stack web application designed to allow users to post and review spots around the city of Toronto. This project is the spiritual successor my previous project **Hang**, featuring a complete overhaul of the frontend from Bootstrap and EJS to a more modern and dynamic stack using React and Material UI. This site can be visited at https://exploretoronto-1.onrender.com/

## Features

- **Spot Management**: Users can create, view, and manage spots on an interactive map of Toronto.
- **User Authentication**: Secure user authentication and session management using PassportJS and express-session cookies.
- **Interactive Mapping**: Integration with Mapbox GL for a responsive and dynamic map interface.
- **Image Upload**: Users can upload images to enhance their posts, with Cloudinary handling the image storage and processing.
- **Data Management**: CRUD (Create, Read, Update, Delete) operations are fully implemented, allowing users to interact with spots and reviews seamlessly.

## Tech Stack

### Backend

- **Node.js & Express**: The server-side logic is handled by Express.js, which provides robust API routing, data validation, and error handling.
- **MongoDB**: Data storage is managed using MongoDB, with Mongoose as the ORM to interact with the database. Express-mongo-sanitize is used to prevent NoSQL injection attacks.
- **PassportJS**: Used for user authentication, employing session-based authentication with cookies.
- **Express-session**: Manages user sessions with secure cookies, ensuring a smooth and persistent user experience.
- **Helmet**: Adds security headers to the application, enhancing protection against common web vulnerabilities.

### Frontend

- **React**: The entire frontend is built using React, allowing for a dynamic and responsive user experience.
- **Material UI**: Provides a modern and consistent design, replacing the older Bootstrap framework from the previous version of the application.
- **Vite**: Used as the build tool for the frontend, ensuring faster and optimized development with hot-reload capabilities.
- **Mapbox GL**: Powers the interactive map feature, allowing users to explore and post spots directly on a map interface.

### Additional Technologies

- **CORS**: Configured to allow cross-origin requests between the frontend and backend, enabling smooth communication across different environments.
- **Cloudinary**: Integrated for handling image uploads, ensuring efficient storage and delivery of media files.
- **MongoStore**: Used to store session data in MongoDB, providing persistence across server restarts.

## Architecture Overview

The application is structured with a clear separation of concerns:

- **Express.js** handles the server-side routing, API logic, and user authentication.
- **React** manages the client-side interface, communicating with the backend via RESTful APIs.
- **MongoDB** serves as the central data store, with Mongoose providing a schema-based solution to model the application data.
- **Mapbox GL** offers a rich, interactive map experience, tightly integrated into the frontend for seamless spot management.

This tech stack ensures that Spot Map App is both scalable and maintainable, providing a robust platform for users to explore and share their favorite spots in the city.
