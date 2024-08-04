// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SpotList from './components/SpotList';
import Home from './components/Home'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/courts" element={<SpotList />} />
        <Route path="/home" element={<Home />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
