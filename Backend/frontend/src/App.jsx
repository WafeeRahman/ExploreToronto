import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpotList from './components/SpotList';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import NavBar from './components/NavBar';
import ShowSpot from './components/ShowSpot';
import { AuthProvider } from './components/AuthContext';
import FlashMessage from './components/FlashMessage';
import { useState, useEffect } from 'react';
import CreateSpot from './components/CreateSpot';
import EditSpot from './components/EditSpot';

import './styles/Styles.css';

const App = () => {
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

  return (
    <AuthProvider>
      <Router>
        <FlashMessage message={flashMessage.message} type={flashMessage.type} onClose={handleCloseFlashMessage} />
        <NavBar />
        <Routes>
          <Route path="/posts" element={<SpotList />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/posts/:id" element={<ShowSpot />} />
          <Route path="/posts/new" element={<CreateSpot />} />
          <Route path="/posts/:id/edit" element={<EditSpot />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
