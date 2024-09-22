import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth-router';
import userRoutes from './routes/users-router';
import groupsRoutes from './routes/groups-router';

const app = express();

app.use(express.json());

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/groups', groupsRoutes);

export {app};