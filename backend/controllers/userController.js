const Poll = require('../models/Poll');
const Review = require('../models/Review');
const Cart = require('../models/cart');
const Product = require('../models/Product');
const ExperienceBooking = require('../models/ExperienceBooking');

exports.createPoll = async (req, res) => {
  try {
    const { question, options, tags } = req.body;
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const poll = new Poll({
      userId: req.user.id,
      question,
      options: options.split(',').map(opt => opt.trim()),
      tags: tags.split(',').map(tag => tag.trim()),
      votes: []
    });
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.votePoll = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const { option } = req.body;
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    if (!poll.options.includes(option)) return res.status(400).json({ message: 'Invalid option' });
    if (poll.votes.some(vote => vote.userId.toString() === req.user.id)) {
      return res.status(400).json({ message: 'User already voted' });
    }
    poll.votes.push({ option, userId: req.user.id });
    await poll.save();
    res.json({ message: 'Vote recorded' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.pollId);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });
    const results = poll.options.reduce((acc, option) => {
      acc[option] = poll.votes.filter(vote => vote.option === option).length;
      return acc;
    }, {});
    res.json({ question: poll.question, results });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPolls = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const polls = await Poll.find({ userId: req.user.id });
    res.json(polls);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.filterPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ tags: req.params.tag });
    res.json(polls);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const { locationServiceName, rating, locationTag, review, tags, image } = req.body;
    const newReview = new Review({
      userId: req.user.id,
      locationServiceName,
      rating,
      locationTag,
      review,
      tags,
      image
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getReviews = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const reviews = await Review.find({ userId: req.user.id });
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.filterReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ tags: req.params.tag });
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.addToCart = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
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
    res.status(201).json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
    res.json(cart || { userId: req.user.id, products: [], total: 0 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getBillSummary = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
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
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createExperienceBooking = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const { className, time, provider, date, notes } = req.body;
    const booking = new ExperienceBooking({
      userId: req.user.id,
      className,
      time,
      provider,
      date,
      notes
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getExperienceBookings = async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).json({ message: 'Access denied: User type required' });
    const bookings = await ExperienceBooking.find({ userId: req.user.id }).populate('provider');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = exports;