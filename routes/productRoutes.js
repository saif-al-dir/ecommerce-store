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

// UPDATE a product (Protected + Upload Image)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Update text fields
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.countInStock = req.body.countInStock || product.countInStock;

    // Update image if a new one was uploaded
    if (req.file) {
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE a product (Protected)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    
    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;