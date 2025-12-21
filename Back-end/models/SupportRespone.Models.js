import mongoose from 'mongoose';

const SupportResponseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, default: Date.now },

  status: {
    type: String,
    enum: ['pending', 'in_progress', 'done'],
    default: 'pending',
  },

  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  handledAt: { type: Date },
  responseMessage: { type: String },
});

const supportResponseModel = mongoose.model('SupportResponse', SupportResponseSchema);
export default supportResponseModel;
