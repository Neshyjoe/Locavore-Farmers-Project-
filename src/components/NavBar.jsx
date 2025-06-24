// Navigation bar with conditional links based on user login state
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../App';
import '../../css/NavBar.css';

function NavBar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="nav-bar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="logo">Locavore</Link>
        <div className="nav-links">
          <Link to="/vendors" className="link">Vendors</Link>
          {user ? (
            <>
              <Link to="/vendors/add" className="link">Add Vendor</Link>
              <button onClick={handleLogout} className="link">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="link">Login</Link>
              <Link to="/register" className="link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;