const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// User Signup
router.post('/user/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: '/user/dashboard' });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// User Login
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    const token = jwt.sign({ id: user._id, type: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: '/user/dashboard' });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Vendor Signup
router.post('/vendor/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = new Vendor({ email, password });
    await vendor.save();
    const token = jwt.sign({ id: vendor._id, type: 'vendor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: '/vendor/dashboard', vendorId: vendor.vendorId });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Vendor Login
router.post('/vendor/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(400).send('Vendor not found');
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');
    const token = jwt.sign({ id: vendor._id, type: 'vendor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: '/vendor/dashboard', vendorId: vendor.vendorId });
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

// Forgot Password (Placeholder - requires email service setup)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const vendor = await Vendor.findOne({ email });
    if (!user && !vendor) return res.status(400).send('Email not found');
    // TODO: Implement email service to send reset link
    res.send('Password reset link sent (placeholder)');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;