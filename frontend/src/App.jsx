import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EndpointDetail from './pages/EndpointDetail';
import StatusPage from './pages/StatusPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/endpoints/:id" element={<PrivateRoute><EndpointDetail /></PrivateRoute>} />
          <Route path="/status/:slug" element={<StatusPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
