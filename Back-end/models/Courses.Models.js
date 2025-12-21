// phòng ban
import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  depart: { type: mongoose.Schema.Types.ObjectId, ref: 'Departs' },
  name: { type: String, required: true },
  levelNumber: { type: Number, required: true },          // mức độ đào tạo
  code: { type: String, required: true, unique: true }, // mã khóa học phải độc nhất
  describe: { type: String }, // mô tả khóa học
  active: { type: Boolean, default: true }
});

const courseModel = mongoose.model('Courses', courseSchema);
export default courseModel
