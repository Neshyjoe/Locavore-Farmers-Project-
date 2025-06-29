import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorList from './pages/VendorList';
import VendorDetail from './pages/VendorDetail';
import VendorForm from './pages/VendorForm';
import ReviewForm from './pages/ReviewForm';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/vendors"
        element={
          <RequireAuth>
            <VendorList />
          </RequireAuth>
        }
      />
      <Route
        path="/vendors/new"
        element={
          <RequireAuth>
            <VendorForm />
          </RequireAuth>
        }
      />
      <Route
        path="/vendors/:id"
        element={
          <RequireAuth>
            <VendorDetail />
          </RequireAuth>
        }
      />
      <Route
        path="/vendors/:id/edit"
        element={
          <RequireAuth>
            <VendorForm />
          </RequireAuth>
        }
      />
      <Route
        path="/reviews/:id/edit"
        element={
          <RequireAuth>
            <ReviewForm />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/vendors" replace />} />
    </Routes>
  );
}

export default App;
