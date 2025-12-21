import supportRequestModel from '../models/SupportRequests.Models.js';

// Gửi yêu cầu hỗ trợ
// export const createSupportRequest = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const newRequest = await supportRequestModel.create({
//       user: req.user._id,
//       title,
//       description
//     });
//     res.status(201).json(newRequest);
//   } catch (err) {
//     res.status(500).json({ message: 'Gửi yêu cầu thất bại', error: err.message });
//   }
// };

// // Xem tất cả yêu cầu hỗ trợ ( staff )
// export const getMySupportRequests = async (req, res) => {
//   try {
//     const requests = await supportRequestModel.find({ user: req.user._id }).sort({ createdAt: -1 });
//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ message: 'Không thể lấy dữ liệu', error: err.message });
//   }
// };

// // Xóa yêu cầu hỗ trợ
// export const deleteSupportRequest = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await supportRequestModel.findOneAndDelete({ _id: id, user: req.user._id });
//     if (!deleted) return res.status(404).json({ message: 'Không tìm thấy yêu cầu để xóa' });
//     res.json({ message: 'Đã xóa yêu cầu hỗ trợ' });
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi xóa yêu cầu', error: err.message });
//   }
// };

const supportRequestsController = {
  createSupportRequest: async (req, res) => {
    try {
      const { title, description } = req.body;
      const newRequest = await supportRequestModel.create({
        user: req.user._id,
        title,
        description
      });
      res.status(201).json(newRequest);
    } catch (err) {
      res.status(500).json({ message: 'Gửi yêu cầu thất bại', error: err.message });
    }
  },
  getMySupportRequests: async (req, res) => {
    try {
      const requests = await supportRequestModel.find({ user: req.user._id }).sort({ createdAt: -1 });
      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: 'Không thể lấy dữ liệu', error: err.message });
    }
  },
  deleteSupportRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await supportRequestModel.findOneAndDelete({ _id: id, user: req.user._id });
      if (!deleted) return res.status(404).json({ message: 'Không tìm thấy yêu cầu để xóa' });
      res.json({ message: 'Đã xóa yêu cầu hỗ trợ' });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi xóa yêu cầu', error: err.message });
    }
  }
}

export default supportRequestsController;