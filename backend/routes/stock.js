const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Stock = require('../models/Stock');

const vendorMiddleware = (req, res, next) => {
  if (req.user.type !== 'vendor') return res.status(403).send('Access denied: Vendor type required');
  next();
};

router.post('/', [authMiddleware, vendorMiddleware], async (req, res) => {
  try {
    const { productName, vendorName, category, productCode, currentStock, minimumStock, unitPrice, suppliersContact, description } = req.body;
    const stock = new Stock({
      vendorId: req.user.id,
      productName,
      vendorName,
      category,
      productCode,
      currentStock,
      minimumStock,
      unitPrice,
      suppliersContact,
      description
    });
    await stock.save();
    res.status(201).send('Stock entry created');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/', [authMiddleware, vendorMiddleware], async (req, res) => {
  try {
    const stocks = await Stock.find({ vendorId: req.user.id });
    res.json(stocks);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;