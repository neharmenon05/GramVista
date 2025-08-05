const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json({ message: 'Product added' });
};

exports.getProducts = async (req, res) => {
  const { vendor } = req.query;
  const products = await Product.find({ vendor });
  res.json(products);
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.json({ message: 'Deleted successfully' });
};
