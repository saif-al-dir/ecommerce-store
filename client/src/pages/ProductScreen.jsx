// client/src/pages/ProductScreen.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, ListGroup, Image, Spinner, Alert, Form } from 'react-bootstrap';
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth(); // Get user to check if they are logged in
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const fetchProduct = async () => {
    try {
      const { data } = await api.get(`/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError('Product not found.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);
    try {
      await api.post(`/api/products/${id}/reviews`, { rating, comment });
      setReviewSuccess(true);
      setComment(''); // Clear the form
      fetchProduct(); // Refetch product to show the new review instantly
    } catch (err) {
      setReviewError(err.response?.data?.error || 'Failed to submit review.');
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!product) return null;

  return (
    <div className="mt-4">
      <Row>
        <Col md={6}>
          <Image src={product.imageUrl} alt={product.name} fluid rounded />
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="fs-2">{product.name}</Card.Title>
              <Card.Text className="text-muted mb-4">{product.description}</Card.Text>
              
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item><strong>Brand:</strong> {product.brand || 'Generic'}</ListGroup.Item>
                <ListGroup.Item><strong>Price:</strong> <span className="text-success fs-4">${product.price}</span></ListGroup.Item>
                <ListGroup.Item>
                  <strong>Status:</strong> {product.countInStock > 0 ? `${product.countInStock} In Stock` : <span className="text-danger">Out of Stock</span>}
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row className="align-items-center">
                      <Col>Quantity</Col>
                      <Col>
                        <Form.Control as="select" value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
              </ListGroup>

              <div className="d-flex gap-2">
                <Button disabled={product.countInStock === 0} onClick={handleAddToCart}>Add to Cart</Button>
                <Link to="/" className="btn btn-light">Go Back</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- REVIEWS SECTION --- */}
      <Row className="mt-5">
        <Col md={6}>
          <h3>Reviews</h3>
          {product.reviews.length === 0 && <Alert variant="info">No reviews yet. Be the first!</Alert>}
          
          <ListGroup variant="flush">
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id} className="py-3">
                <strong>{review.name}</strong>
                <span className="text-warning ms-2">{'⭐'.repeat(review.rating)}</span>
                <p className="mb-0 mt-1 text-muted">{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>

          {/* Review Form */}
          <div className="mt-4">
            <h4>Write a Review</h4>
            {reviewError && <Alert variant="danger">{reviewError}</Alert>}
            {reviewSuccess && <Alert variant="success">Review submitted!</Alert>}
            
            {user ? (
              <Form onSubmit={handleReviewSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control as="select" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Average</option>
                    <option value="2">2 - Poor</option>
                    <option value="1">1 - Terrible</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control as="textarea" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} required />
                </Form.Group>
                <Button type="submit" variant="primary">Submit Review</Button>
              </Form>
            ) : (
              <Alert variant="light">
                Please <Link to="/login">login</Link> to write a review.
              </Alert>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ProductScreen;