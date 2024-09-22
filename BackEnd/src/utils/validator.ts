import mongoose from "mongoose";

const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"|,.<>?]{8,30}$')).required(),
});

const createUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"|,.<>?]{8,30}$')).required(),
})

const signupSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};:\'"|,.<>?]{8,30}$')).required(),
});

const createGroupSchema = Joi.object({
    name: Joi.string().min(1).max(30).required(),
    description: Joi.string().min(5).max(256).required(),
    members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).external((value, helpers) => {
        const ChatUsers = mongoose.model('ChatUsers');
        const invalidIds = [];
    
        return Promise.all(value.map((id) => ChatUsers.findById(id).then((user) => {
          if (!user) {
            invalidIds.push(id);
          }
        }))).then(() => {
          if (invalidIds.length > 0) {
            throw new Error(`Invalid user IDs: ${invalidIds.join(', ')}`);
          }
        });
      }),
})

module.exports = { loginSchema, signupSchema, createUserSchema, createGroupSchema };