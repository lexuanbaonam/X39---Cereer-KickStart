import { Router } from "express";
import personalManagementController from "../controllers/PersonalManagement.Controllers.js";
import { authVerify, authenticateToken, requireUserAdmin } from "../middlewares/Auth.Middlewares.js";

const personalManagementRouter = Router();

personalManagementRouter.get('/personal/:id', authVerify, authenticateToken, requireUserAdmin, personalManagementController.getPersonalInfo); // Lấy thông tin cá nhân
personalManagementRouter.put('/personal/:id', authVerify, authenticateToken, requireUserAdmin, personalManagementController.editPersonalInfo); // Cập nhật thông tin cá nhân
personalManagementRouter.put('/personal/:id/password', authVerify, authenticateToken, requireUserAdmin, personalManagementController.changePassword); // Đổi mật khẩu

export default personalManagementRouter;