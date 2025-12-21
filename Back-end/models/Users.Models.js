import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Accounts', required: true },
  departs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Departs' }], // danh sách phòng ban - fixed ref name
  jobPosition: [{ type: mongoose.Schema.Types.ObjectId, ref: 'JobPositions' }], // danh sách chức vụ - matches JobPositions model

  personalEmail: { type: String, unique: true, required: true },
  companyEmail: { type: String, unique: true }, // Default to empty string if not provided
  name: { type: String, required: true},
  roleTag: { type: String, enum: ['LEADER', 'MEMBER', 'ADMIN'], default: 'MEMBER' }, // phân quyền người dùng
  phoneNumber: { type: String, required: true},
  dob: { type: Date, required: true },
  active: { type: Boolean, default: true },
  online: { type: Boolean, default: false }, // Trạng thái trực tuyến của người dùng
});

const userModel = mongoose.model('Users', userSchema);
export default userModel
