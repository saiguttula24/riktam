import { Error } from 'mongoose';
import { app } from './app'
import { redis } from './redis';
const mongoose = require('mongoose');
require('dotenv').config();


const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
      await redis.connect().then(() => {
        console.log('Redis connected successfully');
      }).catch((err) => {
        console.error('Redis connection failed:', err);
      });
    });
  })
  .catch((error:Error) => {
    console.error('MongoDB connection error:', error);
});
