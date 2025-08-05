const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const vendorMiddleware = (req, res, next) => {
  if (req.user.type !== 'vendor') return res.status(403).send('Access denied: Vendor type required');
  next();
};

router.post('/', [authMiddleware, vendorMiddleware], async (req, res) => {
  try {
    const { type, category, amount, date, description } = req.body;
    const transaction = new Transaction({
      vendorId: req.user.id,
      type,
      category,
      amount,
      date,
      description
    });
    await transaction.save();
    res.status(201).send('Transaction created');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/', [authMiddleware, vendorMiddleware], async (req, res) => {
  try {
    const transactions = await Transaction.find({ vendorId: req.user.id });
    res.json(transactions);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;