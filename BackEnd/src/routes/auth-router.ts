import express from 'express';
import AuthController from '../controllers/auth-controller';
import { verifyToken } from '../utils/helper';

const router = express.Router();

router.post('/login',AuthController.login);
router.post('/signup', AuthController.signup);

// All the routes below this function will be protected
router.use(verifyToken);

router.post('/createUser',AuthController.createUser);

export default router;