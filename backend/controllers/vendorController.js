const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const Stock = require('../models/Stock');
const VillageStay = require('../models/VillageStay');

exports.createProduct = async (req, res) => {
  try {
    if (req.user.type !== 'vendor') return res.status(403).json({ message: 'Access denied: Vendor type required' });
    const { productType, quantity, description, price } = req.body;
    const product = new Product({
      vendorId: req.user.id,
      productType,
      quantity,
      description,
      price
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    if (req.user.type !== 'vendor') return res.status(403).json({ message: 'Access denied: Vendor type required' });
    const products = await Product.find({ vendorId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.filterProducts = async (req, res) => {
  try {
    const products = await Product.find({ productType: req.params.productType });
    res.json(products);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    if (req.user.type !== 'vendor') return res.status(403).json({ message: 'Access denied: Vendor type required' });
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
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    if (req.user.type !== 'vendor') return res.status(403).json({ message: 'Access denied: Vendor type required' });
    const transactions = await Transaction.find({ vendorId: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createStock = async (req, res) => {
  try {
    if (req.user.type !== 'vendor') return res.status(403).json({ message: 'Access denied: Vendor type required' });
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
    res.status(201).json(stock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getStocks = async (req, res) => {
  try {
    if (req.user.type !== 'vendor') return res.status(403).json({ message: 'Access denied: Vendor type required' });
    const stocks = await Stock.find({ vendorId: req.user.id });
    res.json(stocks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createVillageStay = async (req, res) => {
  try {
    if (req.user.type !== 'vendor') return res.status(403).json({ message: 'Access denied: Vendor type required' });
    const { name, location, price, currency, image, amenities, description, maxGuests, rooms, rating, availability, features, ladiesOnly } = req.body;
    const villageStay = new VillageStay({
      vendorId: req.user.id,
      name,
      location,
      price,
      currency,
      image,
      amenities,
      description,
      maxGuests,
      rooms,
      rating,
      availability,
      features,
      ladiesOnly
    });
    await villageStay.save();
    res.status(201).json(villageStay);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getVillageStays = async (req, res) => {
  try {
    if (req.user.type !== 'vendor') return res.status(403).json({ message: 'Access denied: Vendor type required' });
    const villageStays = await VillageStay.find({ vendorId: req.user.id });
    res.json(villageStays);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllVillageStays = async (req, res) => {
  try {
    const villageStays = await VillageStay.find();
    res.json(villageStays);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addVillageStayReview = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const { comment, rating } = req.body;
    const villageStay = await VillageStay.findById(req.params.villageStayId);
    if (!villageStay) return res.status(404).json({ message: 'Village stay not found' });
    villageStay.reviews.push({ userId: req.user.id, comment, rating });
    villageStay.rating = villageStay.reviews.reduce((sum, r) => sum + r.rating, 0) / villageStay.reviews.length;
    await villageStay.save();
    res.json({ message: 'Review added', villageStay });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = exports;