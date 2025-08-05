const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
router.get('/', authMiddleware, (req, res) => {
  res.send('Vendor route is working for user: ' + req.user.id);
});
const vendorController = require('../controllers/vendorController');
router.post('/products', vendorController.createProduct);
router.get('/products', vendorController.getProducts);
router.post('/income-simulator', vendorController.incomeSimulator);


module.exports = router;