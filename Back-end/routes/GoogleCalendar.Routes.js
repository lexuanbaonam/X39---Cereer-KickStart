import express from 'express';
import { createEvent, createEventWithMeet } from '../controllers/GoogleCalendar.Controller.js';

const router = express.Router();

router.post('/create-event', createEvent); // tạo sự kiện thường
router.post('/create-meet', createEventWithMeet); // tạo sự kiện có Google Meet

export default router;
