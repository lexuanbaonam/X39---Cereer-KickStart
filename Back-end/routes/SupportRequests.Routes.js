import express from 'express';
import supportRequestsController from '../controllers/SupportRequests.Controller.js';
import { authVerify, requireAccountAdmin } from '../middlewares/Auth.Middlewares.js';

const supportRequestsRouter = express.Router();

supportRequestsRouter.post('/create', authVerify, supportRequestsController.createSupportRequest);              // Gửi yêu cầu hỗ trợ
supportRequestsRouter.get('/my-requests', authVerify, requireAccountAdmin, supportRequestsController.getMySupportRequests);         // Xem danh sách yêu cầu account - users
supportRequestsRouter.delete('/delete/:id', authVerify, supportRequestsController.deleteSupportRequest);       // Xóa yêu cầu hỗ trợ

export default supportRequestsRouter;
