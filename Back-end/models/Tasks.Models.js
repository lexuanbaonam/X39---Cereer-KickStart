import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  departId: { type: mongoose.Schema.Types.ObjectId, ref: 'Departs', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Courses' },
  sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprints' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], // Danh sách người được giao công việc
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String, 
    enum: ['NOTSTARTED', 'INPROGRESS', 'SUBMITTED', 'NEEDSREVIEW', 'COMPLETE', 'OVERDUE', 'ONHOLD'],
    default: 'NOTSTARTED'
  },
  // submitInfo: { type: String },
  duration: { type: Number, default: 0, min: 0 },
  docTransfer: { type: String }, // Đường dẫn đến tài liệu chuyển giao
  createdAt: { type: Date, default: Date.now }
});

const taskModel = mongoose.model('Tasks', taskSchema);
export default taskModel
