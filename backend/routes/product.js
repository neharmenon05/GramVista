const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Product = require('../models/Product');

const vendorMiddleware = (req, res, next) => {
  if (req.user.type !== 'vendor') return res.status(403).send('Access denied: Vendor type required');
  next();
};

router.post('/', [authMiddleware, vendorMiddleware], async (req, res) => {
  try {
    const { productType, quantity, description, price } = req.body;
    const product = new Product({
      vendorId: req.user.id,
      productType,
      quantity,
      description,
      price
    });
    await product.save();
    res.status(201).send('Product created');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/', [authMiddleware, vendorMiddleware], async (req, res) => {
  try {
    const products = await Product.find({ vendorId: req.user.id });
    res.json(products);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/filter/:productType', async (req, res) => {
  try {
    const products = await Product.find({ productType: req.params.productType });
    res.json(products);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;