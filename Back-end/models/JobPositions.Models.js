import mongoose from 'mongoose';

const jobPositionSchema = new mongoose.Schema({
  title: { type: String, required: true },    // tên chức vụ
  code: { type: String, required: true, unique: true },     // mã chức vụ
  describe: { type: String },
  active: { type: Boolean, default: true },
  createAt: { type: Date, default: Date.now }, // ngày tạo chức vụ
});

const jobPositionModel = mongoose.model('JobPositions', jobPositionSchema);
export default jobPositionModel
