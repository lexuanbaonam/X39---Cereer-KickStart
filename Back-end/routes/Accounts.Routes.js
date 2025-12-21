import express from 'express';
import accountController from '../controllers/Account.Controllers.js';
import { registerValidate, validateLogin, requireUserAdmin, authenticateToken } from '../middlewares/Auth.Middlewares.js'; // Uncomment if you need to use auth middlewares

const accountRouter = express.Router();

accountRouter.post('/register', authenticateToken, registerValidate, requireUserAdmin, accountController.register);       // Đăng ký tài khoản
accountRouter.post('/send-verification', accountController.verifyEmail);            // Gửi email xác thực
accountRouter.get('/verify-email/:token', accountController.verifyAccount); // Xác thực email từ link
accountRouter.post('/login', validateLogin, accountController.login);             // Đăng nhập
// accountRouter.post('/forgot-password', accountController.forgotPassword); // Quên mật khẩu
// accountRouter.post('/reset-password/:token', accountController.resetPassword); // Đặt lại mật khẩu
accountRouter.get('/me', authenticateToken, accountController.getCurrentAccount);
accountRouter.get('/:id', authenticateToken, accountController.getAccountById);           // Lấy thông tin tài khoản đã đăng nhập

export default accountRouter;
