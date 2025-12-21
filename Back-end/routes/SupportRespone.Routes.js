import express from 'express';
import supportResponseController from '../controllers/SupportRespone.Controller.js';
import { authVerify, requireLeaderOrAdmin } from '../middlewares/Auth.Middlewares.js';

const supportResponseRouter = express.Router();

// LEADER/ADMIN xem tất cả yêu cầu
supportResponseRouter.get('/', authVerify, requireLeaderOrAdmin, supportResponseController.getAllSupportResponses);

// LEADER/ADMIN xử lý yêu cầu
supportResponseRouter.patch('/:id', authVerify, requireLeaderOrAdmin, supportResponseController.handleSupportResponse);

supportResponseRouter.post('/', authVerify, requireLeaderOrAdmin, supportResponseController.createSupportResponse); // MEMBER gửi yêu cầu hỗ trợ

export default supportResponseRouter;
