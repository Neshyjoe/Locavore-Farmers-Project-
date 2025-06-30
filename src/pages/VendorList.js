import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchVendors = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/vendors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vendors');
      }
      const data = await response.json();
      console.log('VendorList fetched data:', data);
      setVendors(data.vendors);
    } catch (err) {
      setError('Error loading vendors');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Vendors</h2>
      <button onClick={handleLogout}>Logout</button>
      <Link to="/vendors/new">Add Vendor</Link>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <ul>
        {vendors.map((vendor) => (
          <li key={vendor.id}>
            <Link to={`/vendors/${vendor.id}`}>{vendor.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VendorList;
