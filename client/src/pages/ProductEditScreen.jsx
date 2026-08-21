// client/src/pages/ProductEditScreen.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import api from '../api/axiosConfig';

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
      } catch (err) {
        setError('Failed to load product data');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('brand', brand);
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    if (image) formData.append('image', image);

    try {
      await api.put(`/api/products/${id}`, formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update product.');
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Edit Product</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>
              <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Brand</Form.Label>
              <Form.Control type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Update Image (Optional)</Form.Label>
              <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">Update Product</Button>
              <Link to="/" className="btn btn-light">Cancel</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductEditScreen;