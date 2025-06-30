import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchVendor = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/vendors/' + id, {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vendor details');
      }
      const data = await response.json();
      console.log('VendorDetail fetched data:', data);
      setVendor(data);
    } catch (err) {
      setError('Error loading vendor details');
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/vendors/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!response.ok) {
        throw new Error('Failed to delete vendor');
      }
      navigate('/vendors');
    } catch (err) {
      setError('Error deleting vendor');
    }
  };

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!vendor) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{vendor.name}</h2>
      <p>{typeof vendor.description === 'object' ? JSON.stringify(vendor.description) : vendor.description}</p>
      <p>Location: {typeof vendor.location === 'object' ? JSON.stringify(vendor.location) : vendor.location}</p>
      <Link to={'/vendors/' + id + '/edit'}>Edit Vendor</Link>
      <button onClick={handleDelete}>Delete Vendor</button>
      <h3>Reviews</h3>
      <ul>
        {vendor.reviews.map((review) => (
          <li key={review.id}>
            Rating: {review.rating.toString()} - {typeof review.comment === 'object' ? JSON.stringify(review.comment) : review.comment}
          </li>
        ))}
      </ul>
      <Link to={'/vendors/' + id + '/reviews/new'}>Add Review</Link>
    </div>
  );
}

export default VendorDetail;
