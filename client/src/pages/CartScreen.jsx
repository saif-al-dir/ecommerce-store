// client/src/pages/CartScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Button, Card, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();

  // Calculate total price and total items
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (cartItems.length === 0) {
    return (
      <Alert variant="info" className="mt-5 text-center">
        Your cart is empty. <Link to="/">Go back to products</Link>
      </Alert>
    );
  }

  return (
    <Row className="mt-4">
      <Col md={8}>
        <h2>Shopping Cart</h2>
        <ListGroup variant="flush">
          {cartItems.map((item) => (
            <ListGroup.Item key={item._id} className="d-flex align-items-center p-3">
              <Image 
                src={item.imageUrl} 
                alt={item.name} 
                fluid 
                rounded 
                style={{ width: '80px', height: '80px', objectFit: 'cover' }} 
              />
              <Link to={`/product/${item._id}`} className="ms-3 text-decoration-none flex-grow-1">
                <h5 className="mb-0">{item.name}</h5>
              </Link>
              <div className="me-4">
                <small className="d-block text-muted">Qty: {item.qty}</small>
                <strong>${(item.price * item.qty).toFixed(2)}</strong>
              </div>
              <Button variant="danger" size="sm" onClick={() => removeFromCart(item._id)}>
                Remove
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
      
      <Col md={4}>
        <Card className="mt-4 mt-md-0">
          <Card.Body>
            <h3>Subtotal ({itemCount}) items</h3>
            <div className="my-3 fs-4">
              Total: <span className="fw-bold text-success">${total.toFixed(2)}</span>
            </div>
            <Button variant="success" className="w-100">
              Proceed to Checkout
            </Button>
            <Link to="/" className="btn btn-light w-100 mt-2">
              Continue Shopping
            </Link>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;