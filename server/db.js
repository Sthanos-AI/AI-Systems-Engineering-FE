// Handles the database connection logic.

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        // Exit process with failure
        process.exit(1); 
    }
};

export default connectDB;

// Example Mongoose Schema/Model (Document structure)
const transactionSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    date: { type: Date, required: true },
    merchant: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String },
    // Plaid item ID for multi-bank support
    itemId: { type: String }, 
}, { timestamps: true });

export const Transaction = mongoose.model('Transaction', transactionSchema);