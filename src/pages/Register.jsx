// Registration form for new users
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import '../../css/Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/register', { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/vendors');
    } catch (err) {
      setError('Registration failed');
    }
  };

  return (
    <div id="register-form" className="form-container">
      <h2 className="form-title">Register</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="input"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="input"
      />
      <button onClick={handleSubmit} className="button">
        Register
      </button>
    </div>
  );
}

export default Register;