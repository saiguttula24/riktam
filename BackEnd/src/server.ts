import { redis } from './redis';
import { httpServer } from './socket.io';
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = Number(process.env.PORT) || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully');
    httpServer.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
      redis.connect().then(() => {
        console.log('Redis connected successfully');
      }).catch((err) => {
        console.error('Redis connection failed:', err);
      });
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
});