import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginForm from './components/LoginForm';
import UserTable from './components/UserTable';

const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
      <Router>
        <div className="app">
          <main className="container">
            <Routes>
              <Route path="/" element={<Navigate to="/users" replace />} />
              <Route path="/login" element={<LoginForm />} />
              <Route
                  path="/users"
                  element={
                    <ProtectedRoute>
                      <UserTable />
                    </ProtectedRoute>
                  }
              />
              <Route path="*" element={
                <div className="not-found">
                  <h1>404</h1>
                  <h2>Страница не найдена</h2>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </Router>
  );
};

export default App;
