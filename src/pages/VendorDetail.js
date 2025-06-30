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
      const response = await fetch(`/vendors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch vendor');
      }
      const data = await response.json();
      setVendor(data);
    } catch (err) {
      setError('Error loading vendor');
    }
  };

  useEffect(() => {
    fetchVendor();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete this vendor?')) {
      try {
        const response = await fetch(`/vendors/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error('Failed to delete vendor');
        }
        navigate('/vendors');
      } catch (err) {
        setError('Error deleting vendor');
      }
    }
  };

  if (error) {
    return <p style={{color: 'red'}}>{error}</p>;
  }

  if (!vendor) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{vendor.name}</h2>
      <p>{vendor.description}</p>
      <Link to={`/vendors/${id}/edit`}>Edit Vendor</Link> |{' '}
      <button onClick={handleDelete}>Delete Vendor</button>
      <h3>Reviews</h3>
      <Link to={`/vendors/${id}/reviews/new`}>Add Review</Link>
      <ul>
        {vendor.reviews && vendor.reviews.length > 0 ? (
          vendor.reviews.map((review) => (
            <li key={review.id}>
              <p>Rating: {review.rating} / 5</p>
              <p>{review.comment}</p>
              <Link to={`/reviews/${review.id}/edit`}>Edit Review</Link>
            </li>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </ul>
      <Link to="/vendors">Back to Vendors</Link>
    </div>
  );
}

export default VendorDetail;
