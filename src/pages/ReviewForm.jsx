// Form for adding or editing vendor reviews
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/ReviewForm.css';

function ReviewForm() {
  const { id, vendorId } = useParams();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchReview = async () => {
        try {
          const response = await axios.get(`/api/reviews/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setContent(response.data.content);
        } catch (err) {
          setError('Could not load review data');
        }
      };
      fetchReview();
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      const data = { content, vendorId };
      if (id) {
        await axios.put(`/api/reviews/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('/api/reviews', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      navigate(`/vendors/${vendorId}`);
    } catch (err) {
      setError('Could not save review');
    }
  };

  return (
    <div id="review-form" className="form-container">
      <h2 className="form-title">{id ? 'Edit Review' : 'Add Review'}</h2>
      {error && <p className="error">{error}</p>}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Your review"
        className="input"
      />
      <button onClick={handleSubmit} className="button">
        {id ? 'Update Review' : 'Add Review'}
      </button>
    </div>
  );
}

export default ReviewForm;