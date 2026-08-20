// routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// GET all products (Public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({}).populate('user', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST create a product (Protected + Upload Image)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, brand, category, countInStock } = req.body;
    
    if (!name || !description || !price) {
      return res.status(400).json({ error: 'Name, description, and price are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      brand: brand || '',
      category: category || '',
      countInStock: countInStock || 0,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      user: req.user._id // from the protect middleware
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

module.exports = router;