import { Response } from 'express';
import { LocalsRequest } from '../utils/types';
const Groups = require('../models/group-model');
const { createGroupSchema } = require('../utils/validator');

class GroupsController { 
    async createGroup(req:LocalsRequest, res:Response): Promise<Response> {
        try {
            const value  = await createGroupSchema.validateAsync(req.body);
            if (!value) return res.status(400).send({ success:false, message: "Invalid data" });

            const userId = req.locals?.User?._id;
            if(!userId) return res.status(401).send({ success:false, message: "Access denied" });

            const group = new Groups({name: value.name, description: value.description, createdBy: userId, members: [userId, ...value.members]});
            await group.save();
            const groupId = group._id.toString();
            return res.status(200).send({success:true, message: "Group created successfully", groupId });
        } catch (error) {
          console.log('Error during creating group', error);
          if(error?.details[0]?.message){
            return res.status(400).send({ success:false, message: error?.details[0]?.message });
          }
          return res.status(500).send({ success:false, message: 'Internal server error' });
        }
      }
}

export default new GroupsController();