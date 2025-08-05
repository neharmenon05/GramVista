const User = require('../models/User');
const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.userSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, redirect: '/user/dashboard' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: '/user/dashboard' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.vendorSignup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: 'Vendor already exists' });
    }
    const vendor = new Vendor({ email, password });
    await vendor.save();
    const token = jwt.sign({ id: vendor._id, type: 'vendor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, redirect: '/vendor/dashboard', vendorId: vendor.vendorId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: vendor._id, type: 'vendor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: '/vendor/dashboard', vendorId: vendor.vendorId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const vendor = await Vendor.findOne({ email });
    if (!user && !vendor) return res.status(400).json({ message: 'Email not found' });
    // TODO: Implement email service for password reset
    res.json({ message: 'Password reset link sent (placeholder)' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = exports;