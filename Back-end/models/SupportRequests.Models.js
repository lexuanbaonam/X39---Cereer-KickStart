import mongoose from 'mongoose';

const supportRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  title: { type: String, required: true },                // tiêu đề yêu cầu
  description: { type: String, required: true },          // nội dung yêu cầu
  status: {
    type: String,
    enum: ['Chờ xử lý', 'Đang xử lý', 'Đã hoàn tất', 'Đã hủy'],
    default: 'Chờ xử lý'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const supportRequestModel = mongoose.model('SupportRequests', supportRequestSchema);
export default supportRequestModel;
