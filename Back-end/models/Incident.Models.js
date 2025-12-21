import mongoose from 'mongoose';

const IncidentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, default: Date.now },
  
  type: { type: String, enum: ['system', 'data', 'security'], default: 'system' },

  status: {
    type: String,
    enum: ['new', 'investigating', 'resolved', 'closed'],
    default: 'new',
  },

  handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  handledAt: Date,
  resolutionNote: String
});

export default mongoose.model('Incident', IncidentSchema);
