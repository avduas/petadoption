import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom'; 
import useCurrentUser from '../useCurrentUser';
import { useCookies } from 'react-cookie';
import './navbar.css';

function Navbar() {
  const navigate = useNavigate(); 
  const location = useLocation();
  const currentUser = useCurrentUser(); 
  const isAdmin = currentUser && currentUser.role === 'admin';
  const isLoggedIn = !!currentUser;
  const [, , removeCookie] = useCookies(['jwt']);

  const handleLogout = () => {
    try {
      removeCookie('jwt'); 
      console.log('Logout successful');
      if (location.pathname === '/') {
        window.location.reload(); 
      } else {
        navigate('/'); 
        window.location.reload(); 
      }
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <Nav className="custom-nav">
      <Nav.Item>
        <Link to="/" className="nav-link">Home</Link> 
      </Nav.Item>
      <Nav.Item>
        <Link to="/search" className="nav-link">Search</Link> 
      </Nav.Item>
      {isLoggedIn && (
        <>
          <Nav.Item>
            <Link to="/profile-settings" className="nav-link">Profile Settings</Link> 
          </Nav.Item>
          <Nav.Item>
            <Link to="/my-pets" className="nav-link">My Pets</Link> 
          </Nav.Item>
          {isAdmin && (
            <Nav.Item>
              <Link to="/add-pet" className="nav-link">Add Pet</Link> 
            </Nav.Item>
          )}
          {isAdmin && (
            <Nav.Item>
              <Link to="/dashboard" className="nav-link">Dashboard</Link> 
            </Nav.Item>
          )}
          <Nav.Item>
            <a href="#" className="nav-link" onClick={handleLogout}>Logout</a> 
          </Nav.Item>
        </>
      )}
    </Nav>
  );
}

export default Navbar;
