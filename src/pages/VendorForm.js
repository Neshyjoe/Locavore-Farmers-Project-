import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function VendorForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
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
          setName(data.name);
          setDescription(data.description);
        } catch (err) {
          setError('Error loading vendor');
        }
      };
      fetchVendor();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = localStorage.getItem('token');
    const method = isEdit ? 'PUT' : 'POST';
    const url = isEdit ? `/vendors/${id}` : '/vendors';
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) {
        throw new Error('Failed to save vendor');
      }
      navigate('/vendors');
    } catch (err) {
      setError('Error saving vendor');
    }
  };

  return (
    <div>
      <h2>{isEdit ? 'Edit Vendor' : 'Add Vendor'}</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isEdit ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

export default VendorForm;
