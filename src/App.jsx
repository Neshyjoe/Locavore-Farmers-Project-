import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createContext, useState } from 'react';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VendorList from './pages/VendorList';
import VendorDetail from './pages/VendorDetail';
import VendorForm from './pages/VendorForm';
import ReviewForm from './pages/ReviewForm';
import axios from 'axios';
import './App.css';

// back end 
axios.defaults.baseURL = 'https:-url';

export const AuthContext = createContext(null);

function App() {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <NavBar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vendors" element={<VendorList />} />
            <Route path="/vendors/:id" element={<VendorDetail />} />
            <Route path="/vendors/add" element={<VendorForm />} />
            <Route path="/vendors/edit/:id" element={<VendorForm />} />
            <Route path="/reviews/add/:vendorId" element={<ReviewForm />} />
            <Route path="/reviews/edit/:id" element={<ReviewForm />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;