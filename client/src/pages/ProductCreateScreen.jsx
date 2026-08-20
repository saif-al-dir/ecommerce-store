// client/src/pages/ProductCreateScreen.jsx
import { useState } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ProductCreateScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Use FormData because we are uploading an image file
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('brand', brand);
    formData.append('category', category);
    formData.append('countInStock', countInStock);
    if (image) formData.append('image', image);

    try {
      await api.post('/api/products', formData);
      navigate('/'); // Redirect to home on success
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product. Make sure you are logged in.');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Create New Product</h2>
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
              <Form.Label>Product Image</Form.Label>
              <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" required />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Create Product</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductCreateScreen;