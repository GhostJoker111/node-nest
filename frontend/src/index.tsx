import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000'; // Укажите URL вашего API

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
