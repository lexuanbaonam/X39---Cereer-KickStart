import express from 'express';
import multer from 'multer';
import path from 'path';
import { authVerify } from '../middlewares/Auth.Middlewares.js';
import {
  createDocument,
  updateDocument,
  deleteDocument,
  getMyDocuments,
  uploadDocumentFile // Thêm hàm uploadDocumentFile
} from '../controllers/Documents.Controller.js';

const router = express.Router();

//  CẤU HÌNH UPLOAD 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/documents/'); // Thư mục lưu file
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// CÁC ROUTES 
router.post('/', authVerify, createDocument);         // Tạo tài liệu
router.put('/:id', authVerify, updateDocument);       // Sửa tài liệu
router.delete('/:id', authVerify, deleteDocument);    // Xóa tài liệu
router.get('/', authVerify, getMyDocuments);          // Quản lý danh sách

// ROUTE UPLOAD FILE 
router.post(
  '/upload',
  authVerify,
  upload.single('file'),
  uploadDocumentFile // Gọi controller để lưu vào MongoDB
);

export default router;