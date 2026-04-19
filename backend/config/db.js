import mongoose from 'mongoose';

const connectDB = async () => {
    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RENDER;
    const uri = process.env.MONGO_URI;

    if (!uri && isProduction) {
        console.error('❌ CRITICAL ERROR: MONGO_URI environment variable is missing.');
        console.error('Please add your MongoDB Atlas connection string to the Render dashboard.');
        process.exit(1);
    }

    try {
        const connectionUri = uri || 'mongodb://localhost:27017/ai-builder';
        const conn = await mongoose.connect(connectionUri);
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            console.error(`⚠️ MongoDB Background Error: ${err.message}`);
        });
    } catch (error) {
        console.warn(`⚠️ Primary MongoDB connection failed: ${error.message}`);
        
        if (isProduction) {
            console.error('❌ Database connection failed in production. Check your MONGO_URI and IP Whitelist.');
            process.exit(1);
        }

        console.warn(`🔄 Attempting to fallback to localhost (development only)...`);
        try {
            const fallbackUri = 'mongodb://127.0.0.1:27017/ai-builder';
            const conn = await mongoose.connect(fallbackUri);
            console.log(`✅ Fallback MongoDB connected: ${conn.connection.host}`);
        } catch (fallbackError) {
            console.error(`❌ Fallback MongoDB connection error: ${fallbackError.message}`);
            process.exit(1);
        }
    }
};

export default connectDB;

