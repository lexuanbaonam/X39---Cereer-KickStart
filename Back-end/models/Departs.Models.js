import mongoose from 'mongoose';

const departSchema = new mongoose.Schema({
  title: { type: String, required: true },     // tên phòng ban
  code: { type: String, required: true, unique: true },      // mã phòng ban phải độc nhất
  describe: { type: String },                // mô tả phòng ban
  active: { type: Boolean, default: true }
});

const departModel = mongoose.model('Departs', departSchema);
export default departModel
