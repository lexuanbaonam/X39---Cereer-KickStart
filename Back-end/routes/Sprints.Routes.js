import express from 'express';
import sprintController from '../controllers/Sprints.Controller.js';
import { authVerify, requireUserAdmin, requireUserLeader } from '../middlewares/Auth.Middlewares.js';

const sprintRouter = express.Router();

sprintRouter.post('/add', authVerify, requireUserLeader, sprintController.createSprint);             // Thêm sprint
sprintRouter.get('/all', authVerify, sprintController.getSprint);          // Lấy danh sách sprint
sprintRouter.get('/:sprintId', authVerify, requireUserAdmin, sprintController.getSprintById); // Lấy thông tin sprint theo ID
sprintRouter.get('/user/:staffId', authVerify, sprintController.getSprintsByStaffId); // Lấy danh sách sprint theo staff ID
sprintRouter.put('/:sprintId', authVerify, requireUserAdmin, sprintController.updateSprint); // Cập nhật sprint
sprintRouter.put('/complete/:sprintId', authVerify, requireUserAdmin, sprintController.completeSprint); // Hoàn thành sprint
sprintRouter.delete('/:sprintId', authVerify, requireUserAdmin, sprintController.deleteSprint); // Xóa sprint

export default sprintRouter;
