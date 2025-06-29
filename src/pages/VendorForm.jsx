// Form for adding or editing vendors
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../css/VendorForm.css';

function VendorForm() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchVendor = async () => {
        try {
          const response = await axios.get(`/api/vendors/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setName(response.data.name);
          setDescription(response.data.description);
        } catch (err) {
          setError('Could not load vendor data');
        }
      };
      fetchVendor();
    }
  }, [id]);

  const handleSubmit = async () => {
    try {
      const data = { name, description };
      if (id) {
        await axios.put(`/api/vendors/${id}`, data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('/api/vendors', data, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      navigate('/vendors');
    } catch (err) {
      setError('Could not save vendor');
    }
  };

  return (
    <div id="vendor-form" className="form-container">
      <h2 className="form-title">{id ? 'Edit Vendor' : 'Add Vendor'}</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Vendor Name"
        className="input"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="input"
      />
      <button onClick={handleSubmit} className="button">
        {id ? 'Update Vendor' : 'Add Vendor'}
      </button>
    </div>
  );
}

export default VendorForm;