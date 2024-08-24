import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import NavBar from './components/NavBar.jsx'
import FlashMessage from './components/FlashMessage';

import { useLocation } from 'react-router-dom';
import {useEffect, useState } from 'react';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
