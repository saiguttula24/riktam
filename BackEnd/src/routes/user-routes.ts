import express from 'express';
import UserController from '../controllers/user-controller';
import { verifyToken } from '../utils/helper';

const router = express.Router();

// All the routes below this function will be protected
router.use(verifyToken);

router.get('/',UserController.getAllUsers);

export default router;