import mongoose from 'mongoose';

const adminTaskTimelineSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  timeline: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true, // Admin tạo
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminTaskTimeline = mongoose.model('AdminTaskTimeline', adminTaskTimelineSchema);
export default AdminTaskTimeline;
