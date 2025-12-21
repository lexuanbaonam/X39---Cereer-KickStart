import express from 'express';
import {
    getAllTimelineTasks,
    addTimelineTask,
    updateTimelineTask,
    deleteTimelineTask,
    getTimelineTasksByUser
} from '../controllers/AdminTimelineTasks.Controllers.js';
import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';

const router = express.Router();

// dành riêng cho Admin
router.use(authVerify);         // Xác thực người dùng
router.use(requireUserAdmin);   // Kiểm tra quyền Admin

// Quản lý tất cả timeline task
router.get('/', getAllTimelineTasks);            // Lấy toàn bộ task
router.post('/add', addTimelineTask);            // Thêm task
router.put('/update/:id', updateTimelineTask);   // Cập nhật task
router.delete('/delete/:id', deleteTimelineTask); // Xóa task

// Xem timeline task của 1 người dùng cụ thể -- Admin
router.get('/user/:userId', getTimelineTasksByUser); // Lấy task theo user

export default router;
