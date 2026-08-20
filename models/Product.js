// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 }, // Prevent negative prices
  brand: { type: String, trim: true },
  category: { type: String, trim: true },
  countInStock: { type: Number, required: true, min: 0, default: 0 },
  imageUrl: { type: String },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);