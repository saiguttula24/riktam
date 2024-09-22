
import * as mongoose from 'mongoose';

const groupsSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatUsers',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatUsers'
    }]
});
  
const Groups = mongoose.model('ChatGroups', groupsSchema,'ChatGroups');
  
module.exports = Groups;
  