// Displays details of a single vendor with reviews
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/VendorDetail.css';

function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`/api/vendors/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setVendor(response.data);
      } catch (err) {
        console.error('Failed to fetch vendor', err);
      }
    };
    fetchVendor();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Delete this vendor?')) {
      try {
        await axios.delete(`/api/vendors/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        navigate('/vendors');
      } catch (err) {
        console.error('Failed to delete vendor', err);
      }
    }
  };

  if (!vendor) return <div id="loading" className="container">Loading...</div>;

  return (
    <div id="vendor-detail" className="container">
      <h2 className="title">{vendor.name}</h2>
      <p className="description">{vendor.description}</p>
      {vendor.reviews && (
        <div id="reviews">
          <h3 className="subtitle">Reviews</h3>
          {vendor.reviews.map(review => (
            <div key={review.id} className="card">
              <p className="card-text">{review.content}</p>
              <Link to={`/reviews/edit/${review.id}`} className="link">
                Edit
              </Link>
            </div>
          ))}
          <Link to={`/reviews/add/${id}`} className="button">
            Add Review
          </Link>
        </div>
      )}
      <div id="vendor-actions" className="actions">
        <Link to={`/vendors/edit/${id}`} className="button">
          Edit Vendor
        </Link>
        <button onClick={handleDelete} className="button delete">
          Delete Vendor
        </button>
      </div>
    </div>
  );
}

export default VendorDetail;