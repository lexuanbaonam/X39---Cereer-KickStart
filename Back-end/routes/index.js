import { Router } from 'express';
import accountRouter from './Accounts.Routes.js';
import userRouter from './Users.Routes.js';
import sprintRouter from './Sprints.Routes.js';
import taskRouter from './Tasks.Routes.js';
import notificationRouter from './Notifications.Routes.js';
import documentRouter from './Documents.Routes.js';
import projectRouter from './Projects.Routes.js';
import supportRequestRouter from './SupportRequests.Routes.js';
import supportResponseRouter from './SupportRespone.Routes.js';
import incidentRouter from './Incident.Routes.js'
import googleCalendarRouter from './GoogleCalendar.Routes.js';  
import jobPositionRouter from './JobPositions.Routes.js';
import departRouter from './Departs.Routes.js';
import adminTimelineTasksRouter from './AdminTimelineTasks.Routes.js';
import adminAccessControlRouter from './AdminAccessControl.Routes.js';
import reportRouter from './Report.Routes.js';
import timelineRouter from './Timeline.Routes.js';
import personalManagementRouter from './PersonalManagement.Routes.js';


const router = Router();

router.use('/accounts', accountRouter);
router.use('/users', userRouter);
router.use('/sprints', sprintRouter);
router.use('/tasks', taskRouter);
router.use('/notifications', notificationRouter);
router.use('/documents', documentRouter);
router.use('/projects', projectRouter);
router.use('/supports', supportRequestRouter);      
router.use('/calendars', googleCalendarRouter);       
router.use('/job-positions', jobPositionRouter);
router.use('/departs', departRouter);
router.use('/admin/timeline-tasks', adminTimelineTasksRouter);
router.use('/admin/access-control', adminAccessControlRouter);
router.use('/reports', reportRouter);
router.use('/timelines', timelineRouter);
router.use('/personal-management', personalManagementRouter);
router.use('/supports-response', supportResponseRouter);
router.use('/incidents', incidentRouter); 

export default router;
