// client/src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontWeight: 'bold' }}>
          E-Commerce
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/" className="text-light">Home</Nav.Link>
            
            <Nav.Link as={Link} to="/cart" className="text-light me-3">
              Cart
              {cartCount > 0 && (
                <span className="badge bg-warning text-dark ms-1">{cartCount}</span>
              )}
            </Nav.Link>

            {user ? (
              <>
                {user?.isAdmin && (
                  <Nav.Link as={Link} to="/admin/create-product" className="text-light">
                    Create Product
                  </Nav.Link>
                )}
                
                <Nav.Link as={Link} to="/profile" className="text-warning ms-3 me-3">
                  Hello, {user.name}!
                </Nav.Link>
                
                <Button variant="outline-danger" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-light">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="text-light">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;