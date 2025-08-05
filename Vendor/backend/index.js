// index.js (ES Module version)

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/userAuth.js';
import vendorRoutes from './routes/vendorRoutes.js';

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

mongoose.connect('//User1:pass@cluster0.ygshmkz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected to gramvista'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/user', userRoutes);
app.use('/api/vendor', vendorRoutes);

app.get('/', (req, res) => {
    res.send('GramVista Backend API is running...');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
