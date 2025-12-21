import express from 'express';
import { authVerify } from '../middlewares/Auth.Middlewares.js';
import { getNewNotifications, markAsRead, deleteNotifications } from '../controllers/Notifications.Controller.js';

const router = express.Router();

router.get('/new', authVerify, getNewNotifications); // Xem thông báo mới
router.put('/mark-read', authVerify, markAsRead);    // Đánh dấu đã đọc
router.delete('/', authVerify, deleteNotifications); // Xóa thông báo

export default router;
