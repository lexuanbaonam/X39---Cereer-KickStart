// import { socketUtils } from './Socket.Controllers.js';
// import messageModel from '../models/Messages.Model.js';

// const socketRESTController = {
//     // Get Socket.IO server status
//     getSocketStatus: (req, res) => {
//         try {
//             const io = req.app.get('io');
            
//             res.json({
//                 status: 'OK',
//                 connectedClients: io.engine.clientsCount,
//                 totalRooms: io.sockets.adapter.rooms.size,
//                 onlineUsers: socketUtils.getOnlineUsersCount(),
//                 timestamp: new Date()
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to get socket status', 
//                 error: error.message 
//             // });
//         }
//     },

//     // Get online users
//     getOnlineUsers: (req, res) => {
//         try {
//             const onlineUsers = socketUtils.getOnlineUsers();
            
//             res.json({
//                 users: onlineUsers,
//                 count: onlineUsers.length,
//                 timestamp: new Date()
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to get online users', 
//                 error: error.message 
//             });
//         }
//     },

//     // Send notification to specific user
//     sendNotification: (req, res) => {
//         try {
//             const { userId, message, type = 'info' } = req.body;
//             const io = req.app.get('io');

//             if (!userId || !message) {
//                 return res.status(400).json({ 
//                     message: 'User ID and message are required' 
//                 });
//             }

//             const sent = socketUtils.sendToUser(userId, 'notification', {
//                 message,
//                 type,
//                 from: req.account._id,
//                 timestamp: new Date()
//             }, io);

//             res.json({
//                 success: sent,
//                 message: sent ? 'Notification sent successfully' : 'User is offline',
//                 timestamp: new Date()
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to send notification', 
//                 error: error.message 
//             });
//         }
//     },

//     // Join user to room
//     joinRoom: (req, res) => {
//         try {
//             const { roomId, roomType = 'general' } = req.body;
//             const userId = req.account._id;
//             const io = req.app.get('io');

//             if (!roomId) {
//                 return res.status(400).json({ message: 'Room ID is required' });
//             }

//             // Send join room event to user's sockets
//             const sent = socketUtils.sendToUser(userId, 'force_join_room', {
//                 roomId,
//                 roomType,
//                 timestamp: new Date()
//             }, io);

//             res.json({
//                 success: sent,
//                 message: sent ? 'Room join request sent' : 'User is offline',
//                 roomId,
//                 roomType
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to join room', 
//                 error: error.message 
//             });
//         }
//     },

//     // Leave room
//     leaveRoom: (req, res) => {
//         try {
//             const { roomId } = req.body;
//             const userId = req.account._id;
//             const io = req.app.get('io');

//             if (!roomId) {
//                 return res.status(400).json({ message: 'Room ID is required' });
//             }

//             const sent = socketUtils.sendToUser(userId, 'force_leave_room', {
//                 roomId,
//                 timestamp: new Date()
//             }, io);

//             res.json({
//                 success: sent,
//                 message: sent ? 'Room leave request sent' : 'User is offline',
//                 roomId
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to leave room', 
//                 error: error.message 
//             });
//         }
//     },

//     // Get user's rooms (from database or cache)
//     getUserRooms: async (req, res) => {
//         try {
//             const { userId } = req.params;

//             // TODO: Implement room membership logic
//             // This would typically query your database for rooms the user belongs to
            
//             res.json({
//                 userId,
//                 rooms: [],
//                 message: 'Room membership feature to be implemented',
//                 timestamp: new Date()
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to get user rooms', 
//                 error: error.message 
//             });
//         }
//     },

//     // Send message via REST API
//     sendMessage: async (req, res) => {
//         try {
//             const { roomId, content, messageType = 'text', receiverId } = req.body;
//             const senderId = req.account._id;
//             const io = req.app.get('io');

//             if (!content || (!roomId && !receiverId)) {
//                 return res.status(400).json({ 
//                     message: 'Content and either roomId or receiverId are required' 
//                 });
//             }

//             // Create message data
//             const messageData = {
//                 sender: senderId,
//                 content,
//                 messageType,
//                 timestamp: new Date()
//             };

//             if (receiverId) {
//                 messageData.receiver = receiverId;
//                 messageData.chatType = 'private';
//             } else {
//                 messageData.roomId = roomId;
//                 messageData.chatType = 'room';
//             }

//             // Save to database if you have message model
//             // const savedMessage = await messageModel.create(messageData);

//             // Send via Socket.IO
//             if (receiverId) {
//                 // Private message
//                 const roomName = [senderId, receiverId].sort().join('_');
//                 io.to(roomName).emit('new_message', messageData);
//             } else {
//                 // Room message
//                 io.to(roomId).emit('new_message', messageData);
//             }

//             res.json({
//                 success: true,
//                 message: 'Message sent successfully',
//                 data: messageData
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to send message', 
//                 error: error.message 
//             });
//         }
//     },

//     // Get room messages
//     getRoomMessages: async (req, res) => {
//         try {
//             const { roomId } = req.params;
//             const { page = 1, limit = 50 } = req.query;

//             // TODO: Implement message retrieval from database
//             // const messages = await messageModel.find({ roomId })
//             //     .populate('sender', 'name avatar')
//             //     .sort({ timestamp: -1 })
//             //     .limit(limit * 1)
//             //     .skip((page - 1) * limit);

//             res.json({
//                 roomId,
//                 messages: [],
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 total: 0,
//                 message: 'Message history feature to be implemented'
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to get messages', 
//                 error: error.message 
//             });
//         }
//     },

//     // Mark message as read
//     markMessageRead: async (req, res) => {
//         try {
//             const { messageId } = req.params;
//             const readerId = req.account._id;
//             const io = req.app.get('io');

//             // TODO: Update message read status in database
//             // const message = await messageModel.findByIdAndUpdate(messageId, {
//             //     isRead: true,
//             //     readAt: new Date()
//             // });

//             // Notify sender via Socket.IO
//             socketUtils.sendToUser('SENDER_ID', 'message_read', {
//                 messageId,
//                 readerId,
//                 readAt: new Date()
//             }, io);

//             res.json({
//                 success: true,
//                 message: 'Message marked as read',
//                 messageId
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to mark message as read', 
//                 error: error.message 
//             });
//         }
//     },

//     // Admin: Get Socket.IO statistics
//     getAdminStats: (req, res) => {
//         try {
//             // Check if user is admin
//             if (req.account.role !== 'ADMIN') {
//                 return res.status(403).json({ message: 'Access denied' });
//             }

//             const io = req.app.get('io');
//             const rooms = Array.from(io.sockets.adapter.rooms.keys());
//             const sockets = Array.from(io.sockets.sockets.keys());

//             res.json({
//                 connectedClients: io.engine.clientsCount,
//                 totalRooms: rooms.length,
//                 totalSockets: sockets.length,
//                 onlineUsers: socketUtils.getOnlineUsersCount(),
//                 rooms: rooms.slice(0, 10), // Show first 10 rooms
//                 timestamp: new Date()
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to get admin stats', 
//                 error: error.message 
//             });
//         }
//     },

//     // Admin: Broadcast message to all users
//     broadcastMessage: (req, res) => {
//         try {
//             // Check if user is admin
//             if (req.account.role !== 'ADMIN') {
//                 return res.status(403).json({ message: 'Access denied' });
//             }

//             const { message, type = 'announcement' } = req.body;
//             const io = req.app.get('io');

//             if (!message) {
//                 return res.status(400).json({ message: 'Message is required' });
//             }

//             // Broadcast to all connected clients
//             io.emit('admin_broadcast', {
//                 message,
//                 type,
//                 from: 'System Admin',
//                 timestamp: new Date()
//             });

//             res.json({
//                 success: true,
//                 message: 'Broadcast sent successfully',
//                 recipients: io.engine.clientsCount
//             });
//         } catch (error) {
//             res.status(500).json({ 
//                 message: 'Failed to broadcast message', 
//                 error: error.message 
//             });
//         }
//     }
// };

// export default socketRESTController;