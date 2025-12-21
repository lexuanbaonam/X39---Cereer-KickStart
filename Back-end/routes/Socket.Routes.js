// import express from 'express';
// import { authVerify } from '../middlewares/Auth.Middlewares.js';
// import socketController from '../controllers/Socket.REST.Controllers.js';

// const socketRouter = express.Router();

// // All socket routes require authentication
// socketRouter.use(authVerify);

// // Socket management routes
// socketRouter.get('/status', socketController.getSocketStatus);
// socketRouter.get('/online-users', socketController.getOnlineUsers);
// socketRouter.post('/send-notification', socketController.sendNotification);
// socketRouter.post('/join-room', socketController.joinRoom);
// socketRouter.post('/leave-room', socketController.leaveRoom);
// socketRouter.get('/rooms/:userId', socketController.getUserRooms);

// // Message routes
// socketRouter.post('/send-message', socketController.sendMessage);
// socketRouter.get('/messages/:roomId', socketController.getRoomMessages);
// socketRouter.put('/messages/:messageId/read', socketController.markMessageRead);

// // Admin only routes
// socketRouter.get('/admin/stats', socketController.getAdminStats);
// socketRouter.post('/admin/broadcast', socketController.broadcastMessage);

// export default socketRouter;