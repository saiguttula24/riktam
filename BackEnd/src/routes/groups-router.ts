import express from 'express';
import GroupsController from '../controllers/groups-controller';
import { verifyToken } from '../utils/helper';

const router = express.Router();

// All the routes below this function will be protected
router.use(verifyToken);

router.post('/createGroup',GroupsController.createGroup);

export default router;