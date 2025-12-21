

// //  LEADER/ADMIN xem tất cả yêu cầu hỗ trợ
// export const getAllSupportResponses = async (req, res) => {
//   try {
//     const responses = await supportResponseModel.find()
//       .populate('createdBy', 'fullName role')
//       .populate('handledBy', 'fullName role')
//       .sort({ createdAt: -1 });

//     res.status(200).json(responses);
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi máy chủ' });
//   }
// };

// // LEADER/ADMIN xử lý yêu cầu hỗ trợ
export const handleSupportResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responseMessage } = req.body;

    const response = await SupportResponse.findById(id);
    if (!response) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu hỗ trợ' });
    }

    response.status = status || 'đang xử lí';
    response.responseMessage = responseMessage;
    response.handledBy = req.user._id;
    response.handledAt = new Date();

    // Nếu có responseMessage và handledBy thì cập nhật là đã xử lý
    if (response.responseMessage && response.handledBy) {
      response.status = 'đã xử lý';
    }

    await response.save();

    res.status(200).json({ message: 'Đã cập nhật yêu cầu hỗ trợ', response });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};


import supportResponseModel from "../models/SupportRespone.Models.js";

const supportResponseController = {
  createSupportResponse: async (req, res) => {
    try {
      const { title, description } = req.body;
      const newResponse = new supportResponseModel({
        title,
        description,
        createdBy: req.account._id, // Sử dụng req.account đã được authVerify middleware gán
      });

      await newResponse.save();
      res.status(201).json({ message: 'Yêu cầu hỗ trợ đã được tạo', response: newResponse });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
  },
  getAllSupportResponses: async (req, res) => {
    try {
      const responses = await supportResponseModel.find()
        .populate('createdBy', 'email role')
        .populate('handledBy', 'email role')
        .sort({ createdAt: -1 });

      res.status(200).json(responses);
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
  },
  handleSupportResponse: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, responseMessage } = req.body;

      const response = await supportResponseModel.findById(id);
      if (!response) {
        return res.status(404).json({ message: 'Không tìm thấy yêu cầu hỗ trợ' });
      }

      response.status = status || 'đang xử lí';
      response.responseMessage = responseMessage;
      response.handledBy = req.account._id; // Sử dụng req.account đã được authVerify middleware gán
      response.handledAt = new Date();

      await response.save();

      res.status(200).json({ message: 'Đã cập nhật yêu cầu hỗ trợ', response });
    } catch (err) {
      res.status(500).json({ message: 'Lỗi máy chủ', error: err.message });
    }
  }
}

export default supportResponseController;