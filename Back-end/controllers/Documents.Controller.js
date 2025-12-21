import Document from '../models/Documents.Models.js';

//  Tạo tài liệu
export const createDocument = async (req, res) => {
  const doc = await Document.create({ ...req.body, ownerId: req.user._id });
  res.json(doc);
};

// Cập nhật tài liệu
export const updateDocument = async (req, res) => {
  const { id } = req.params;
  const doc = await Document.findOneAndUpdate(
    { _id: id, ownerId: req.user._id },
    req.body,
    { new: true }
  );
  res.json(doc);
};

// Xóa tài liệu
export const deleteDocument = async (req, res) => {
  const { id } = req.params;
  await Document.findOneAndDelete({ _id: id, ownerId: req.user._id });
  res.json({ message: 'Deleted' });
};

// Lấy danh sách tài liệu của người dùng
export const getMyDocuments = async (req, res) => {
  const docs = await Document.find({ ownerId: req.user._id });
  res.json(docs);
};

// Upload file từ máy lên và tạo tài liệu mới
export const uploadDocumentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được tải lên." });
    }

    const fileUrl = `/uploads/documents/${req.file.filename}`;

    const doc = await Document.create({
      title: req.body.title || "Tài liệu không tiêu đề",
      content: req.body.content || "",
      fileUrl,
      ownerId: req.user._id,
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi tải file lên.", error: err.message });
  }
};
