import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:8000'; // Укажите URL вашего API

// перед КАЖДЫМ запросом автоматически кладём токен в заголовок Authorization
// Бэкенд (JwtAuthGuard) ждёт "Authorization: Bearer <token>" на защищённых роутах (напр. GET /users)
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
