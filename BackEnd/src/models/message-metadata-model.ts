import * as mongoose from 'mongoose';

const messageMetadataSchema = new mongoose.Schema({
    messageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatMessages',
      required: true
    },
    type: {
      type: String,
      enum: ['like', 'read'],
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatUsers',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  });
  
const MessageMetadata = mongoose.model('ChatMessageMetadata', messageMetadataSchema, 'ChatMessageMetadata');

module.exports = MessageMetadata;