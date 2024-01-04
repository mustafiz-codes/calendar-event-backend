// connection.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const databaseUrl: string =
  process.env.MONGO_URL || 'your_default_database_url';

const connectDatabase = async () => {
  try {
    await mongoose.connect(databaseUrl);
    console.log('Connected to the database!');
  } catch (error) {
    console.error('Connection error', error);
    process.exit(1);
  }
};

mongoose.connection.on('error', (error: Error) => {
  console.error('Database connection error:', error);
});

export { connectDatabase };
