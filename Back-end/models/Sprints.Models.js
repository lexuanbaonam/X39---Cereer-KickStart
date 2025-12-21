import mongoose from 'mongoose';

const sprintSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // người sở hữu sprint
  taskId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' }], // danh sách công việc liên quan
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], // danh sách thành viên tham gia sprint
  title: { type: String, required: true },            // tên công việc hoặc sprint
  description: { type: String },                      // mô tả công việc
  startDate: { type: Date, required: true },          // ngày bắt đầu
  endDate: { type: Date, required: true },            // ngày kết thúc
  status: {
    type: String,
    enum: ['NOTSTARTED', 'INPROGRESS', 'COMPLETED'],
    default: 'NOTSTARTED'
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }, // liên kết dự án 
  createdAt: { type: Date, default: Date.now },
});

const sprintModel = mongoose.model('Sprints', sprintSchema);
export default sprintModel;
