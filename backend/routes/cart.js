const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Cart = require('../models/cart');
const Product = require('../models/Product');

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).send('Product not found');
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new Cart({ userId: req.user.id, products: [], total: 0 });
    }
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    cart.total = (await Promise.all(cart.products.map(async p => {
      const prod = await Product.findById(p.productId);
      return prod.price * p.quantity;
    }))).reduce((sum, val) => sum + val, 0);
    await cart.save();
    res.status(201).send('Cart updated');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(cart || { userId: req.user.id, products: [], total: 0 });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/bill-summary', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    if (!cart) return res.json({ products: [], total: 0 });
    const summary = {
      products: cart.products.map(p => ({
        name: p.productId.productType,
        quantity: p.quantity,
        price: p.productId.price,
        subtotal: p.quantity * p.productId.price
      })),
      total: cart.total
    };
    res.json(summary);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;