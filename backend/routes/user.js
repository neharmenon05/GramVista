const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  res.send(`User route is working for user: ${req.user.id}`);
});
router.post('/itinerary', userController.createItinerary);
router.post('/poll', userController.createPoll);
router.post('/review', userController.createReview);
router.post('/carbon-offset', userController.calculateCarbonOffset);

module.exports = router;