import jobPositionController from "../controllers/JobPositions.Controllers.js"
import { Router } from "express"

const jobPositionRouter = Router()

jobPositionRouter.post('/create', jobPositionController.createJobPosition); // Tạo chức vụ mới
jobPositionRouter.get('/all', jobPositionController.getAllJobPositions); // Lấy tất cả chức vụ

export default jobPositionRouter;