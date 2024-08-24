// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpotList from './components/SpotList';
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup';
import NavBar from './components/NavBar';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
const App = () => {
  return (
    <AuthProvider>
    <Router>
      <NavBar></NavBar>
      <Routes>
        <Route path="/posts" element={<SpotList />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
