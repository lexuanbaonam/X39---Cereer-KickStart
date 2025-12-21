import express from 'express';
import {
  createIncident,
  getAllIncidents,
  handleIncident,
} from '../controllers/Incident.Controller.js';

import { authVerify, requireLeaderOrAdmin } from '../middlewares/Auth.Middlewares.js';

const router = express.Router();

// Tạo sự cố
router.post('/', authVerify, createIncident);

// Xem tất cả sự cố
router.get('/', authVerify, requireLeaderOrAdmin, getAllIncidents);

// Xử lý sự cố
router.patch('/:id', authVerify, requireLeaderOrAdmin, handleIncident);

export default router;
