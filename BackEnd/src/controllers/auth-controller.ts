import { Request, Response } from 'express';
const bcrypt = require('bcrypt');
const Users = require('../models/user-model');
const jwt = require('jsonwebtoken');
const { loginSchema, signupSchema, createUserSchema } = require('../utils/validator');

class AuthController {

    async login(req:Request, res:Response): Promise<Response> {
      try {
        const { error, value } = loginSchema.validate(req.body);
        if (error) return res.status(400).send({ success:false, message: error.details[0].message });
    
        const User = await Users.findOne({ email: value.email });
        if (!User) return res.status(404).send({ success:false, message: 'Users not found' });
    
        const passwordMatch = await bcrypt.compare(value.password, User.password);
        if (!passwordMatch) return res.status(401).send({ success:false, message: 'Incorrect password' });
    
        const token = jwt.sign({ User }, process.env.JWT_SECRET, { expiresIn: '8h' });
    
        return res.status(200).send({ success:true, message: 'Login successful', token: token, 
          user: {username: User.username, email: User.email, isAdmin: User.isAdmin, isVerified: User.isVerified} });
      } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).send({ success:false, message: 'Internal server error' });
      }
    }

    async createUser(req: Request, res: Response): Promise<Response> {
      try{
          const { error, value } = createUserSchema.validate(req.body);
          if (error) return res.status(400).send({ success:false, message: error.details[0].message });
      
          const existingUser = await Users.findOne({
            $or: [
              { username: value.username },
              { email: value.email }
            ]
          });
          if (existingUser) return res.status(400).send({ success:false, message: 'User already created' });
      
          const hashedPassword = await bcrypt.hash(value.password, 10);
      
          const newUser = new Users({ ...value, password: hashedPassword });
          await newUser.save();
      
          return res.status(201).send({ success:true, message: 'User created successfully' });
      }catch (error) {
          console.error('Error during creating user:', error);
          return res.status(500).send({ success:false, message: 'Internal server error' });
      }
    }

    async signup(req: Request, res: Response): Promise<Response> {
      try {
          const { error, value } = signupSchema.validate(req.body);
          if (error) return res.status(400).send({ success:false, message: error.details[0].message });
      
          const existingUser = await Users.findOne({ username: value.username });
          if (!existingUser) return res.status(400).send({ success:false, message: 'User doesnt exist' });
      
          const hashedPassword = await bcrypt.hash(value.password, 10);
          existingUser.password = hashedPassword;
          existingUser.isVerified = true;

          await existingUser.save();

          return res.status(200).send({ success: true, message: 'User verified successfully' });
      } catch (error) {
          console.error('Error during signup:', error);
          return res.status(500).send({ success:false, message: 'Internal server error' });
      }
    }

  }
  
  export default new AuthController();