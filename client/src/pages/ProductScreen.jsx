// client/src/pages/ProductScreen.jsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, ListGroup, Image, Spinner, Alert, Form } from 'react-bootstrap';
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart function
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1); // State for quantity

  useEffect(() => {
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
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty); // Add the product and quantity to context
    navigate('/cart'); // Redirect to cart page
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
  if (!product) return null;

  return (
    <Row className="mt-4">
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

              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row className="align-items-center">
                    <Col>Quantity</Col>
                    <Col>
                      <Form.Control 
                        as="select" 
                        value={qty} 
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
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
              <Button 
                disabled={product.countInStock === 0} 
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
              <Link to="/" className="btn btn-light">Go Back</Link>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductScreen;