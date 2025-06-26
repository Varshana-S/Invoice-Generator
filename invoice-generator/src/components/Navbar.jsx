import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className={`navbar ${isAuthPage ? 'auth-navbar' : ''}`}>
      <div className="nav-left">
        <Link to="/" className="logo">
          <span className="logo-icon">📄</span>
          <span className="logo-text">Invoice Generator</span>
        </Link>
        {!isAuthPage && (
          <div className="nav-links">
            <Link to="/invoice">Create Invoice</Link>
            <Link to="/docs">Documentation</Link>
            <Link to="/help">Help</Link>
          </div>
        )}
      </div>
      {!isAuthPage && (
        <div className="nav-right">
          {isAuthenticated ? (
            <>
              <Link to="/invoice" className="nav-link">Invoice</Link>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="signin-link">Sign In</Link>
              <Link to="/signup"><button className="signup-btn">Sign Up</button></Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
