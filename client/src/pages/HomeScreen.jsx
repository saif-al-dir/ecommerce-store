// client/src/pages/HomeScreen.jsx
import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const HomeScreen = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // Add a delete handler function:
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        setDeleteError('Failed to delete product.');
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/api/products');
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 1. Show Spinner while loading
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // 2. Show Error if fetch fails
  if (error) {
    return <Alert variant="danger" className="mt-5">{error}</Alert>;
  }

  // 3. Show message if no products exist
  if (products.length === 0) {
    return <h2 className="text-center mt-5 text-muted">No products available yet.</h2>;
  }

  // 4. Display Products
  return (
    <Row>
      {products.map((product) => (
        <Col key={product._id} sm={12} md={6} lg={4} xl={3} className="mb-4">
          <Card className="h-100 shadow-sm">
            {/* Product Image */}
            {product.imageUrl ? (
              <Card.Img 
                variant="top" 
                src={product.imageUrl} 
                style={{ height: '200px', objectFit: 'cover' }} 
              />
            ) : (
              <div 
                className="bg-light d-flex align-items-center justify-content-center" 
                style={{ height: '200px' }}
              >
                <span className="text-muted">No Image</span>
              </div>
            )}
            
            <Card.Body className="d-flex flex-column">
              <Card.Title>{product.name}</Card.Title>
              <Card.Text className="text-muted">{product.brand}</Card.Text>
              
              {/* Push price and button to the bottom */}
              <div className="mt-auto">
                <Card.Text className="fs-5 fw-bold text-success mb-3">
                  ${product.price}
                </Card.Text>
                <Button as={Link} to={`/product/${product._id}`} variant="primary" className="w-100 mb-2">
                  View Details
                </Button>
                {/* Admin CRUD Buttons */}
                {user && (
                  <div className="d-flex gap-2">
                    <Button as={Link} to={`/admin/product/${product._id}/edit`} variant="warning" className="w-100">
                      Edit
                    </Button>
                    <Button variant="danger" className="w-100" onClick={() => handleDelete(product._id)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default HomeScreen;