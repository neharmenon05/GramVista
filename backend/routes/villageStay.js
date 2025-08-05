const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const VillageStay = require('../models/VillageStay');

const vendorMiddleware = (req, res, next) => {
  if (req.user.type !== 'vendor') return res.status(403).send('Access denied: Vendor type required');
  next();
};

router.post('/', [authMiddleware, vendorMiddleware], async (req, res) => {
  try {
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
    res.status(201).send('Village stay created');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/', [authMiddleware, vendorMiddleware], async (req, res) => {
  try {
    const villageStays = await VillageStay.find({ vendorId: req.user.id });
    res.json(villageStays);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.get('/all', async (req, res) => {
  try {
    const villageStays = await VillageStay.find();
    res.json(villageStays);
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

router.post('/review/:villageStayId', authMiddleware, async (req, res) => {
  try {
    if (req.user.type !== 'user') return res.status(403).send('Access denied: User type required');
    const { comment, rating } = req.body;
    const villageStay = await VillageStay.findById(req.params.villageStayId);
    if (!villageStay) return res.status(404).send('Village stay not found');
    villageStay.reviews.push({ userId: req.user.id, comment, rating });
    villageStay.rating = villageStay.reviews.reduce((sum, r) => sum + r.rating, 0) / villageStay.reviews.length;
    await villageStay.save();
    res.send('Review added');
  } catch (err) {
    res.status(400).send('Error: ' + err.message);
  }
});

module.exports = router;