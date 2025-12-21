import AccessControl from '../models/AdminAccessControl.Models.js';
import userModel from '../models/Users.Models.js';

const accessControlController = {
  // Cấp quyền
  grantAccess: async (req, res) => {
    try {
      const { userId, roles } = req.body;

      let access = await AccessControl.findOne({ userId });
      if (access) {
        return res.status(400).json({ message: 'Người dùng đã có quyền truy cập. Hãy cập nhật' });
      }

      access = await AccessControl.create({ userId, roles });
      res.status(201).json({ message: 'Cấp quyền truy cập thành công.', access });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Cập nhật hoặc tự tạo nếu chưa có
  updateAccess: async (req, res) => {
    try {
      const { userId, roles } = req.body;

     const access = await AccessControl.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { roles },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      res.status(200).json({ message: 'Cập nhật hoặc cấp quyền truy cập thành công', access });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Xóa quyền
  deleteAccess: async (req, res) => {
    try {
      const { userId } = req.params;

      const access = await AccessControl.findOneAndDelete({ userId });

      if (!access) {
        return res.status(404).json({ message: 'Không tìm thấy quyền truy cập' });
      }

      res.status(200).json({ message: 'Xóa quyền truy cập thành công' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default accessControlController;
