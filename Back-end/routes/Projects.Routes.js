import { Router } from 'express';
import { authVerify, requireUserAdmin } from '../middlewares/Auth.Middlewares.js';
import projectController from '../controllers/Projects.Controller.js';

const projectRouter = Router();

projectRouter.post('/add', authVerify, requireUserAdmin, projectController.createProject); // Thêm dự án
projectRouter.put('/update/:projectId', authVerify, requireUserAdmin, projectController.updateProjectInfo); // Cập nhật thông tin dự án
projectRouter.post('/add-user/:projectId', authVerify, requireUserAdmin, projectController.addUserToProject); // Thêm người dùng vào dự án
projectRouter.post('/add-sprint/:projectId', authVerify, requireUserAdmin, projectController.addSprintToProject); // Thêm sprint vào dự án
projectRouter.delete('/delete/:projectId', authVerify, requireUserAdmin, projectController.deleteProject); // Xóa dự án
projectRouter.get('/all', authVerify, projectController.getAllProjects); // Lấy danh sách dự án
projectRouter.get('/:projectId', authVerify, projectController.getProjectById); // Lấy thông tin dự án theo ID
projectRouter.get('/:projectId/members', authVerify, projectController.getAllMembersInProject); // Lấy danh sách thành viên dự án
projectRouter.get('/progress/:projectId', authVerify, projectController.getProjectReport); // Lấy tiến độ dự án

export default projectRouter;
