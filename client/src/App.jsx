// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import HomeScreen from './pages/HomeScreen';
import ProductScreen from './pages/ProductScreen';
import CartScreen from './pages/CartScreen';
import Footer from './components/Footer';
import ProfileScreen from './pages/ProfileScreen';
import { CartProvider } from './context/CartContext';
import ProductCreateScreen from './pages/ProductCreateScreen';
import ProductEditScreen from './pages/ProductEditScreen';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import AdminRoute from './components/AdminRoute';


const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container style={{ flex: 1 }} className="mt-4">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/product/:id" element={<ProductScreen />} />
                <Route path="/admin/create-product" element={<AdminRoute><ProductCreateScreen /></AdminRoute>} />
                <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />
              </Routes>
            </Container>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;