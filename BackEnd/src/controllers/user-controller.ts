import { Response } from 'express';
import { LocalsRequest } from '../utils/types';
const Users = require('../models/user-model');

class UserController { 
    async getAllUsers(req:LocalsRequest, res:Response): Promise<Response> {
        try {
            const userId = req.locals?.User?._id;
            if(!userId) return res.status(401).send({ success:false, message: "User not found" });

            const users = await Users.find({
                $and: [
                    { isVerified: true },
                    { isAdmin: { $ne: true } }
                ]
            })

            return res.status(200).send({success:true, users});
        } catch (error) {
          console.error('Error during getting all user:', error);
          return res.status(500).send({ success:false, message: 'Internal server error' });
        }
      }
}

export default new UserController();