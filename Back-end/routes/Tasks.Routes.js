import express from 'express';
import taskController from '../controllers/Task.Controllers.js';
import { authVerify, requireUserLeader } from '../middlewares/Auth.Middlewares.js';

const taskRouter = express.Router();

// Task CRUD operations
taskRouter.post('/create', authVerify, taskController.createTask);          // Tạo task mới (Admin/Leader only)
taskRouter.get('/all', authVerify, taskController.getAllTasks);                                // Lấy tất cả task 
taskRouter.get('/my-tasks', authVerify, taskController.getMyTasks);                            // Lấy task cá nhân
taskRouter.get('/:taskId', authVerify, taskController.getTaskById);                            // Lấy task theo ID
taskRouter.put('/:taskId/update', authVerify, requireUserLeader, taskController.updateTask);  // Cập nhật task (Admin/Leader only)
taskRouter.delete('/:taskId/delete', authVerify, requireUserLeader, taskController.deleteTask); // Xóa task (Admin/Leader only)

// Task actions
taskRouter.post('/:taskId/submit', authVerify, taskController.submitTask);                     // Gửi thông tin task (Assignees)

// Assignee management (Admin only)
taskRouter.post('/:taskId/add-assignee', authVerify, requireUserLeader, taskController.addAssignee);        // Thêm người thực hiện
taskRouter.delete('/:taskId/remove-assignee/:assigneeId', authVerify, requireUserLeader, taskController.removeAssignee); // Xóa người thực hiện

export default taskRouter;