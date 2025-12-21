import { Router } from "express";
import timelineController from "../controllers/Timeline.Controllers.js";
import { authVerify, requireUserAdmin } from "../middlewares/Auth.Middlewares.js";

const timelineRouter = Router();

timelineRouter.post('/', authVerify, requireUserAdmin, timelineController.createTimeline); // Tạo timeline mới
timelineRouter.put('/:timelineId', authVerify, requireUserAdmin, timelineController.updateTimeline); // Cập nhật timeline
timelineRouter.get('/tasks', authVerify, timelineController.getTaskTimeline); // Lấy danh sách công việc trong timeline
timelineRouter.get('/analyze', authVerify, timelineController.analyzeTimeline); // Phân tích timeline

export default timelineRouter;