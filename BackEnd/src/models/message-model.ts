import * as mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatGroups',
      required: true
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatUsers',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});
  
const Messages = mongoose.model('ChatMessages', messageSchema,'ChatMessages');

module.exports = Messages;