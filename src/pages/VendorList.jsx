// Displays list of vendors fetched from backend
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/VendorList.css';

function VendorList() {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get('/api/vendors', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setVendors(response.data);
      } catch (err) {
        console.error('Failed to fetch vendors', err);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div id="vendor" className="container">
      <h2 className="title">Vendors</h2>
      <div className="vendor-grid">
        {vendors.map(vendor => (
          <div key={vendor.id} className="card">
            <h3 className="card-title">{vendor.name}</h3>
            <p className="card-text">{vendor.description}</p>
            <Link to={`/vendors/${vendor.id}`} className="link">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorList;