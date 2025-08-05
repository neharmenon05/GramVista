require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const vendorController = require('./controllers/vendorController');
const { authMiddleware, vendorMiddleware } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/gramvista', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/api/auth/user/signup', authController.userSignup);
app.post('/api/auth/user/login', authController.userLogin);
app.post('/api/auth/vendor/signup', authController.vendorSignup);
app.post('/api/auth/vendor/login', authController.vendorLogin);
app.post('/api/auth/forgot-password', authController.forgotPassword);

app.post('/api/poll', authMiddleware, userController.createPoll);
app.post('/api/poll/vote/:pollId', authMiddleware, userController.votePoll);
app.get('/api/poll/results/:pollId', userController.getPollResults);
app.get('/api/poll', authMiddleware, userController.getPolls);
app.get('/api/poll/filter/:tag', userController.filterPolls);

app.post('/api/review', authMiddleware, userController.createReview);
app.get('/api/review', authMiddleware, userController.getReviews);
app.get('/api/review/filter/:tag', userController.filterReviews);

app.post('/api/cart', authMiddleware, userController.addToCart);
app.get('/api/cart', authMiddleware, userController.getCart);
app.get('/api/cart/bill-summary', authMiddleware, userController.getBillSummary);

app.post('/api/experienceBooking', authMiddleware, userController.createExperienceBooking);
app.get('/api/experienceBooking', authMiddleware, userController.getExperienceBookings);

app.post('/api/product', [authMiddleware, vendorMiddleware], vendorController.createProduct);
app.get('/api/product', [authMiddleware, vendorMiddleware], vendorController.getProducts);
app.get('/api/product/filter/:productType', vendorController.filterProducts);

app.post('/api/transaction', [authMiddleware, vendorMiddleware], vendorController.createTransaction);
app.get('/api/transaction', [authMiddleware, vendorMiddleware], vendorController.getTransactions);

app.post('/api/stock', [authMiddleware, vendorMiddleware], vendorController.createStock);
app.get('/api/stock', [authMiddleware, vendorMiddleware], vendorController.getStocks);

app.post('/api/villageStay', [authMiddleware, vendorMiddleware], vendorController.createVillageStay);
app.get('/api/villageStay', [authMiddleware, vendorMiddleware], vendorController.getVillageStays);
app.get('/api/villageStay/all', vendorController.getAllVillageStays);
app.post('/api/villageStay/review/:villageStayId', authMiddleware, vendorController.addVillageStayReview);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
