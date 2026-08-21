// client/src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  // Format date like: "October 25, 2023"
  const formattedDate = today.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <footer className="bg-dark text-light mt-4 py-4">
      <Container>
        <Row className="text-center">
          <Col>
            <h6>SAIF E-Commerce Store</h6>
            <p className="mb-1 text-secondary">
              Built with the MERN Stack & Vite. &copy; {currentYear}
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;