const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Review = require('../models/Review');

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
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
    res.status(201).send('Review created');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const reviews = await Review.find({ userId: req.user.id });
    res.json(reviews);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/all', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/filter/:tag', async (req, res) => {
  try {
    const reviews = await Review.find({ tags: req.params.tag });
    res.json(reviews);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;