import express from 'express';
import accessControlController from '../controllers/AdminAccessControl.Controller.js';

import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';

const router = express.Router();

// Tất cả đều là chức năng của admin
router.post('/grant', authVerify, requireUserAdmin, accessControlController.grantAccess);        // Cấp quyền
router.put('/update', authVerify, requireUserAdmin, accessControlController.updateAccess);       // Chỉnh sửa quyền
router.delete('/delete/:userId', authVerify, requireUserAdmin, accessControlController.deleteAccess); // Xóa quyền

export default router;