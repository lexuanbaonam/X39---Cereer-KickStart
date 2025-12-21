import { Router } from "express";
import reportsController from "../controllers/Report.Controllers.js";
import { authVerify, requireAccountAdmin } from "../middlewares/Auth.Middlewares.js";

const reportRouter = Router();

reportRouter.get('/overview', authVerify, requireAccountAdmin, reportsController.getOverviewReport); // Lấy báo cáo tổng quan
reportRouter.get('/detailed', authVerify, requireAccountAdmin, reportsController.getDetailedReport); // Lấy báo cáo chi tiết theo loại và ID
reportRouter.get('/performance', authVerify, requireAccountAdmin, reportsController.analyzeWorkPerformance);
reportRouter.get('/projects/progress', authVerify, requireAccountAdmin, reportsController.analyzeProjectProgress); // Lấy báo cáo tiến độ dự án

export default reportRouter;