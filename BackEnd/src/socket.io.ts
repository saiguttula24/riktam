import { Server } from 'socket.io';
import { createServer } from 'http';
import { app } from './app';
const Groups = require('./models/group-model');
const jwt = require('jsonwebtoken');
import { redis } from './redis';
import { group } from 'console';
import mongoose from 'mongoose';
const Message = require('./models/message-model');
const MessageMetadata = require('./models/message-metadata-model');

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.use((socket:any, next) => {
  const token = socket.handshake.auth.token;
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return next(Error('Authentication failed'));
    }
    socket.user = decoded;
    next();
  });
});

io.on('connection', (socket:any) => {
  console.log('New client connected');

  if(redis.isOpen){
    const userId = socket.user.User._id.toString();
    const socketId = socket.id;
    redis.set(userId,socketId);
  }

  socket.on('getAllGroups',async (callback) => {
    const userId = socket.user.User._id;
    const groups = await Groups.find({ members: { $in: [userId] } });
    for(let group of groups) {
      socket.join(group._id.toString());
    }
    const rooms = Array.from(socket.adapter.rooms.keys());
    for (const roomId of rooms) {
      const roomConnections = Array.from(socket.adapter.rooms.get(roomId));
      console.log(`Room ${roomId} connections:`, roomConnections);
    }
    callback(groups);
  })

  socket.on('getChat',async (callback) => {
    const userId = socket.user.User._id;
    const groups = await Groups.find({ members: { $in: [userId] } });
    let chat = {};
    for(let group of groups) {
      const groupId = group._id.toString();
      socket.join(groupId);
      // const conversation = await Message.find({groupId: groupId}).sort({ createdAt: 1 }).lean();
      // for(let message of conversation){
      //   const messageId = message._id.toString();
      //   const likes = await MessageMetadata.find({messageId,type:'like'}).select('userId');
      //   console.log("likes",likes);
      //   message['likes'] = likes;
      // }
      const conversation = await Message.aggregate([
        {
          $match: { groupId: new mongoose.Types.ObjectId(groupId) },
        },
        {
          $sort: { createdAt: 1 },
        },
        {
          $lookup: {
            from: 'ChatMessageMetadata',
            localField: '_id',
            foreignField: 'messageId',
            pipeline: [{ $match: { type: 'like' } }],
            as: 'likes',
          },
        },
        {
          $addFields: {
            likes: '$likes.userId',
          },
        },
      ]);
      console.log(conversation);
      chat[groupId] = conversation;
    }
    callback(chat);
  })

  socket.on('sendMessage', async(data, callback) => {
    try{
      const groupId = data.groupId.toString();
      const message = data.message;
      const userId = socket.user.User._id;

      if(!groupId || !message || !userId) {
        socket.emit('customError',{message:"Unknown error occured"})
      }else{
        const newMessage = await Message.create({ groupId, message, sentBy: userId });
        console.log(newMessage);
        console.log('Emitting to group:', groupId);
        const messageObject = { ...newMessage.toObject(), likes: [] };
        socket.broadcast.to(groupId).emit('groupMessage', {...messageObject,likes:[]});
        callback({...messageObject,likes:[]});
      }
    }catch(err){
      console.error('Error saving message:', err);
      socket.emit('customError',{message:"Unknown error occured"});
    }
  });

  socket.on('updateGroupUsers',async(data,callback)=>{
    try{
      const groupId = data.groupId.toString();
      const members = data.members;
      const userId = socket.user.User._id;

      members.push(userId);

      await Groups.updateOne(
        { _id: groupId },
        { $set: { members: members } }
      );

      const memberSocketIds = await Promise.all(
        members.map((memberId) => redis.get(memberId.toString()))
      );

      const onlineMemberSocketIds = memberSocketIds.filter((socketId) => socketId !== null);

      onlineMemberSocketIds.forEach((socketId) => {
        io.to(socketId).emit('refreshGroup',true);
      });

      callback(true);
    }catch(err){
      console.error('Error Updating users:', err);
      socket.emit('customError',{message:"Unknown error occured"});
      callback(false);
    }
  })

  socket.on("newGroupCreated",async(data,callback)=>{
    try{
      const groupId = data.groupId;

      const group = await Groups.findOne({_id:groupId});
      const members = group.members;

      console.log("members",members);

      const memberSocketIds = await Promise.all(
        members.map((memberId) => redis.get(memberId.toString()))
      );

      const onlineMemberSocketIds = memberSocketIds.filter((socketId) => socketId !== null);

      onlineMemberSocketIds.forEach((socketId) => {
        io.to(socketId).emit('refreshGroup',true);
      });
    }catch(err){
      console.error('Error While creating group:', err);
      socket.emit('customError',{message:"Unknown error occured"});
    }
  })

  socket.on("deleteGroup",async(data,callback)=>{
    try{
      const groupId = data.groupId;

      const group = await Groups.findOneAndDelete({_id:groupId});
      const members = group.members;

      await Message.deleteMany({ groupId });

      const memberSocketIds = await Promise.all(
        members.map((memberId) => redis.get(memberId.toString()))
      );

      const onlineMemberSocketIds = memberSocketIds.filter((socketId) => socketId !== null);

      onlineMemberSocketIds.forEach((socketId) => {
        io.to(socketId).emit('refreshGroup',true);
      });
    }catch(err){
      console.error('Error Deleting group:', err);
      socket.emit('customError',{message:"Unknown error occured"});
    }
  })

  socket.on("exitGroup", async(data,callback)=>{
    try{
      const groupId = data.groupId;
      const userId = socket.user.User._id.toString();

      const updateResult = await Groups.updateOne(
        { _id: groupId },
        { $pull: { members: userId } }
      );

      console.log(updateResult);

      if (updateResult.modifiedCount === 1) {
        console.log(`User ${userId} is not a member of group ${groupId}`);
        callback(true);
      } else {
        socket.emit('customError',{message:"Unknown error occured"});
      }
    }catch(err){
      console.error('Error exiting group:', err);
      socket.emit('customError',{message:"Unknown error occured"});
    }
  })

  socket.on('like',async(data,callback)=>{
    try{
      const messageId = data.id.toString();
      const groupId = data.groupId.toString();
      const userId = socket.user.User._id.toString();

      const existingLike = await MessageMetadata.findOne({
        messageId,
        userId,
        type: 'like',
      });

      if(existingLike) {
        console.log('User has already liked this message');
        callback(false);
        return;
      }

      const like = new MessageMetadata({messageId,userId,type:'like'});
      await like.save();

      const group = await Groups.findOne({_id:groupId});
      const members = group.members;

      const memberSocketIds = await Promise.all(
        members.map((memberId) => redis.get(memberId.toString()))
      );

      const onlineMemberSocketIds = memberSocketIds.filter((socketId) => socketId !== null);

      onlineMemberSocketIds.forEach((socketId) => {
        io.to(socketId).emit('liked',{groupId,messageId,userId});
      });
      callback(true);
    }catch(err){
      console.error('Error while liking:', err);
      socket.emit('customError',{message:"Unknown error occured"});
    }
  })

  socket.on('disconnect', async() => {
    console.log('Client disconnected');
    const userId = socket.user.User._id;
    const groups = await Groups.find({ members: { $in: [userId] } });

    for(let group of groups) {
      socket.leave(group._id.toString());
    };

    if(redis.isOpen){
      const userId = socket.user.User._id.toString();
      redis.del(userId);
    }
  });

});

export { io, httpServer };