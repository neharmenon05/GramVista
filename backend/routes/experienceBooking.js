const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const ExperienceBooking = require('../models/ExperienceBooking');

router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
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
    res.status(201).send('Experience booking created');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const bookings = await ExperienceBooking.find({ userId: req.user.id }).populate('provider');
    res.json(bookings);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;