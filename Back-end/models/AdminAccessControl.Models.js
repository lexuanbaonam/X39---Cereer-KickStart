import mongoose from 'mongoose';

const accessControlSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  roles: {
    type: [String], 
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('AccessControl', accessControlSchema);
