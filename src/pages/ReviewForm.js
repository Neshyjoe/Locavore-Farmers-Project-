import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ReviewForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchReview = async () => {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(`/reviews/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch review');
          }
          const data = await response.json();
          setRating(data.rating);
          setComment(data.comment);
          setVendorId(data.vendor_id);
        } catch (err) {
          setError('Error loading review');
        }
      };
      fetchReview();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/reviews/${id}` : '/reviews';
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment, vendor_id: vendorId }),
      });
      if (!response.ok) {
        throw new Error('Failed to save review');
      }
      navigate(`/vendors/${vendorId}`);
    } catch (err) {
      setError('Error saving review');
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Review' : 'Add Review'}</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Rating (1-5):</label><br />
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Comment:</label><br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Vendor ID:</label><br />
          <input
            type="text"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            required
            disabled={isEdit}
          />
        </div>
        <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

export default ReviewForm;
