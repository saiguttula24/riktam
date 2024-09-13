import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth-router';
import userRoutes from './routes/user-routes'

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);

export {app};