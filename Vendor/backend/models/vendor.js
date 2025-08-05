// models/vendor.js
import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
