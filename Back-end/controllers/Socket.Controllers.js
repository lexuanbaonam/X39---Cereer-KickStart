// import accountModel from "../models/Accounts.Models.js";
// import userModel from "../models/Users.Models.js";
// import groupModel from "../models/Groups.Models.js";
// import messageModel from "../models/Messages.Model.js";
// import jwt from "jsonwebtoken";

// // Lưu trữ người dùng online với nhiều socket (multi-tab)
// const onlineUsers = new Map(); // userId -> Set of socket.id
// const socketToUser = new Map(); // socket.id -> { userId, userInfo }
// const userProfiles = new Map(); // userId -> userProfile info

// const socketController = (io) => {
//     // Middleware xác thực Socket
//     io.use(async (socket, next) => {
//         try {
//             const token = socket.handshake.auth.token || 
//                          socket.handshake.headers.authorization?.replace('Bearer ', '');
            
//             if (!token) {
//                 return next(new Error('❌ Authentication failed: No token provided'));
//             }

//             // Verify JWT token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             const account = await accountModel.findById(decoded.accountId);
            
//             if (!account) {
//                 return next(new Error('❌ Authentication failed: Account not found'));
//             }

//             // Find user profile
//             const userProfile = await userModel.findOne({ accountId: account._id });
//             if (!userProfile) {
//                 return next(new Error('❌ Authentication failed: User profile not found'));
//             }

//             // Attach user info to socket
//             socket.userId = userProfile._id.toString();
//             socket.accountId = account._id.toString();
//             socket.userInfo = {
//                 name: userProfile.name,
//                 email: userProfile.personalEmail || account.email,
//                 avatar: userProfile.avatar,
//                 role: account.role
//             };

//             console.log(`🔐 Socket authenticated: ${userProfile.name} (${socket.id})`);
//             next();
//         } catch (error) {
//             console.error('❌ Socket authentication error:', error.message);
//             return next(new Error('Authentication failed'));
//         }
//     });

//     io.on('connection', (socket) => {
//         console.log(`🔌 New connection: ${socket.id}`);
        
//         // Setup user events
//         setupUserEvents(socket, io);
        
//         // Setup chat events
//         setupChatEvents(socket, io);
        
//         // Setup socket events
//         setupSocketEvents(socket, io);
//     });

//     // Setup user-related events
//     const setupUserEvents = (socket, io) => {
//         // User login
//         socket.on('user_login', () => {
//             handleUserLogin(socket, io);
//         });

//         // User logout
//         socket.on('user_logout', () => {
//             handleUserLogout(socket, io);
//         });

//         // Get online users
//         socket.on('get_online_users', () => {
//             handleGetOnlineUsers(socket, io);
//         });

//         // User status update
//         socket.on('update_status', (data) => {
//             handleUpdateUserStatus(socket, data, io);
//         });
//     };

//     // Setup chat-related events
//     const setupChatEvents = (socket, io) => {
//         // Join room
//         socket.on('join_room', (data) => {
//             handleJoinRoom(socket, data, io);
//         });

//         // Leave room
//         socket.on('leave_room', (data) => {
//             handleLeaveRoom(socket, data, io);
//         });

//         // Send message
//         socket.on('send_message', (data) => {
//             handleSendMessage(socket, data, io);
//         });

//         // Private chat
//         socket.on('join_private_chat', (data) => {
//             handleJoinPrivateChat(socket, data, io);
//         });

//         socket.on('send_private_message', (data) => {
//             handleSendPrivateMessage(socket, data, io);
//         });

//         // Group chat
//         socket.on('join_group', (data) => {
//             handleJoinGroup(socket, data, io);
//         });

//         socket.on('send_group_message', (data) => {
//             handleSendGroupMessage(socket, data, io);
//         });

//         // Message read status
//         socket.on('mark_message_read', (data) => {
//             handleMarkMessageRead(socket, data, io);
//         });

//         // Typing indicators
//         socket.on('user_typing_start', (data) => {
//             handleTypingStart(socket, data, io);
//         });

//         socket.on('user_typing_stop', (data) => {
//             handleTypingStop(socket, data, io);
//         });
//     };

//     // Setup general socket events
//     const setupSocketEvents = (socket, io) => {
//         // Auto-login when connected
//         handleUserLogin(socket, io);

//         // Handle disconnection
//         socket.on('disconnect', (reason) => {
//             handleUserDisconnect(socket, reason, io);
//         });

//         // Handle errors
//         socket.on('error', (error) => {
//             console.error(`❌ Socket error for ${socket.id}:`, error);
//         });

//         // Ping/Pong for connection health
//         socket.on('ping', () => {
//             socket.emit('pong', { timestamp: new Date() });
//         });
//     };

//     // Event Handlers
//     const handleUserLogin = (socket, io) => {
//         const userId = socket.userId;
//         const userInfo = socket.userInfo;

//         // Initialize user's socket set if not exists
//         if (!onlineUsers.has(userId)) {
//             onlineUsers.set(userId, new Set());
//         }

//         // Add socket to user's socket set
//         onlineUsers.get(userId).add(socket.id);

//         // Map socket to user
//         socketToUser.set(socket.id, { userId, userInfo });

//         // Cache user profile
//         userProfiles.set(userId, userInfo);

//         // Join user to personal room
//         socket.join(`user_${userId}`);

//         // Emit to other users that this user is online
//         socket.broadcast.emit('user_online', {
//             userId,
//             userInfo: {
//                 name: userInfo.name,
//                 avatar: userInfo.avatar
//             },
//             status: 'online',
//             timestamp: new Date()
//         });

//         // Send current online users to the new user
//         const currentOnlineUsers = Array.from(userProfiles.entries()).map(([id, profile]) => ({
//             userId: id,
//             userInfo: {
//                 name: profile.name,
//                 avatar: profile.avatar
//             },
//             status: 'online'
//         }));

//         socket.emit('online_users_list', {
//             users: currentOnlineUsers,
//             count: currentOnlineUsers.length
//         });

//         console.log(`✅ User login: ${userInfo.name} (${socket.id})`);
//         console.log(`📊 Online users: ${onlineUsers.size}`);
//     };

//     const handleUserLogout = (socket, io) => {
//         const userId = socket.userId;
        
//         if (userId && onlineUsers.has(userId)) {
//             const userSockets = onlineUsers.get(userId);
//             userSockets.delete(socket.id);

//             // If no more sockets for this user, mark as offline
//             if (userSockets.size === 0) {
//                 onlineUsers.delete(userId);
//                 userProfiles.delete(userId);

//                 // Notify others user went offline
//                 socket.broadcast.emit('user_offline', {
//                     userId,
//                     status: 'offline',
//                     timestamp: new Date()
//                 });

//                 console.log(`📴 User logout: ${userId}`);
//             }
//         }

//         socketToUser.delete(socket.id);
//     };

//     const handleUserDisconnect = (socket, reason, io) => {
//         console.log(`🔌 User disconnected: ${socket.id} - Reason: ${reason}`);
//         handleUserLogout(socket, io);
//     };

//     const handleJoinRoom = (socket, data, io) => {
//         const { roomId, roomType = 'general' } = data;
//         const userId = socket.userId;
//         const userInfo = socket.userInfo;

//         if (!roomId) {
//             socket.emit('error', { message: 'Room ID is required' });
//             return;
//         }

//         // Join the room
//         socket.join(roomId);

//         // Notify room members
//         socket.to(roomId).emit('user_joined_room', {
//             userId,
//             userInfo: {
//                 name: userInfo.name,
//                 avatar: userInfo.avatar
//             },
//             roomId,
//             roomType,
//             timestamp: new Date()
//         });

//         // Confirm to user
//         socket.emit('room_joined', {
//             roomId,
//             roomType,
//             message: `Joined room ${roomId} successfully`
//         });

//         console.log(`🏠 User ${userInfo.name} joined room: ${roomId}`);
//     };

//     const handleLeaveRoom = (socket, data, io) => {
//         const { roomId } = data;
//         const userId = socket.userId;
//         const userInfo = socket.userInfo;

//         if (!roomId) {
//             socket.emit('error', { message: 'Room ID is required' });
//             return;
//         }

//         // Leave the room
//         socket.leave(roomId);

//         // Notify room members
//         socket.to(roomId).emit('user_left_room', {
//             userId,
//             userInfo: {
//                 name: userInfo.name,
//                 avatar: userInfo.avatar
//             },
//             roomId,
//             timestamp: new Date()
//         });

//         // Confirm to user
//         socket.emit('room_left', {
//             roomId,
//             message: `Left room ${roomId} successfully`
//         });

//         console.log(`🚪 User ${userInfo.name} left room: ${roomId}`);
//     };

//     const handleSendMessage = async (socket, data, io) => {
//         try {
//             const { roomId, content, messageType = 'text', replyTo } = data;
//             const senderId = socket.userId;
//             const senderInfo = socket.userInfo;

//             if (!roomId || !content) {
//                 socket.emit('message_error', { error: 'Room ID and content are required' });
//                 return;
//             }

//             // Create message data
//             const messageData = {
//                 sender: senderId,
//                 content,
//                 messageType,
//                 chatType: 'room',
//                 timestamp: new Date()
//             };

//             if (replyTo) {
//                 messageData.replyTo = replyTo;
//             }

//             // Save to database
//             const savedMessage = await messageModel.create(messageData);
//             await savedMessage.populate('sender', 'name personalEmail avatar');

//             const responseData = {
//                 _id: savedMessage._id,
//                 sender: {
//                     _id: savedMessage.sender._id,
//                     name: savedMessage.sender.name,
//                     avatar: savedMessage.sender.avatar
//                 },
//                 content: savedMessage.content,
//                 messageType: savedMessage.messageType,
//                 roomId,
//                 timestamp: savedMessage.timestamp,
//                 replyTo: savedMessage.replyTo
//             };

//             // Send to room
//             io.to(roomId).emit('new_message', responseData);

//             console.log(`💬 Message sent by ${senderInfo.name} to room ${roomId}`);

//         } catch (error) {
//             console.error('❌ Error sending message:', error);
//             socket.emit('message_error', { error: 'Failed to send message' });
//         }
//     };

//     const handleJoinPrivateChat = async (socket, data, io) => {
//         try {
//             const { otherUserId } = data;
//             const currentUserId = socket.userId;

//             // Validate other user exists
//             const otherUser = await userModel.findById(otherUserId);
//             if (!otherUser) {
//                 socket.emit('chat_error', { error: 'User not found' });
//                 return;
//             }

//             // Create room name (sorted to ensure consistency)
//             const roomName = [currentUserId, otherUserId].sort().join('_');
            
//             // Join room
//             socket.join(roomName);

//             // Notify other user if online
//             if (isUserOnline(otherUserId)) {
//                 sendToUser(otherUserId, 'private_chat_joined', {
//                     userId: currentUserId,
//                     userInfo: socket.userInfo,
//                     roomName
//                 }, io);
//             }

//             socket.emit('private_chat_joined', {
//                 roomName,
//                 otherUserId,
//                 otherUserInfo: {
//                     name: otherUser.name,
//                     avatar: otherUser.avatar
//                 },
//                 message: 'Joined private chat successfully'
//             });

//             console.log(`💬 ${socket.userInfo.name} joined private chat with ${otherUser.name}`);

//         } catch (error) {
//             console.error('❌ Error joining private chat:', error);
//             socket.emit('chat_error', { error: 'Failed to join private chat' });
//         }
//     };

//     const handleSendPrivateMessage = async (socket, data, io) => {
//         try {
//             const { receiverId, content, messageType = 'text' } = data;
//             const senderId = socket.userId;

//             // Validate data
//             if (!receiverId || !content) {
//                 socket.emit('message_error', { error: 'Receiver ID and content are required' });
//                 return;
//             }

//             // Create room name
//             const roomName = [senderId, receiverId].sort().join('_');

//             // Save message to database
//             const newMessage = await messageModel.create({
//                 sender: senderId,
//                 receiver: receiverId,
//                 content,
//                 messageType,
//                 isRead: false,
//                 chatType: 'private',
//                 timestamp: new Date()
//             });

//             // Populate sender info
//             await newMessage.populate('sender', 'name personalEmail avatar');

//             const messageData = {
//                 _id: newMessage._id,
//                 sender: {
//                     _id: newMessage.sender._id,
//                     name: newMessage.sender.name,
//                     avatar: newMessage.sender.avatar
//                 },
//                 receiver: receiverId,
//                 content: newMessage.content,
//                 messageType: newMessage.messageType,
//                 isRead: false,
//                 timestamp: newMessage.timestamp,
//                 chatType: 'private'
//             };

//             // Send to both users in the private chat
//             io.to(roomName).emit('new_private_message', messageData);

//             console.log(`📨 Private message from ${socket.userInfo.name} to ${receiverId}`);

//         } catch (error) {
//             console.error('❌ Error sending private message:', error);
//             socket.emit('message_error', { error: 'Failed to send private message' });
//         }
//     };

//     const handleJoinGroup = async (socket, data, io) => {
//         try {
//             const { groupId } = data;
//             const userId = socket.userId;

//             // Validate group exists and user is member
//             const group = await groupModel.findById(groupId);
//             if (!group) {
//                 socket.emit('group_error', { error: 'Group not found' });
//                 return;
//             }

//             if (!group.members.includes(userId)) {
//                 socket.emit('group_error', { error: 'You are not a member of this group' });
//                 return;
//             }

//             // Join group room
//             socket.join(`group_${groupId}`);

//             // Notify other group members
//             socket.to(`group_${groupId}`).emit('user_joined_group', {
//                 groupId,
//                 userId,
//                 userInfo: socket.userInfo
//             });

//             socket.emit('group_joined', {
//                 groupId,
//                 groupName: group.name,
//                 message: 'Successfully joined group'
//             });

//             console.log(`👥 User ${socket.userInfo.name} joined group ${group.name}`);

//         } catch (error) {
//             console.error('❌ Error joining group:', error);
//             socket.emit('group_error', { error: 'Failed to join group' });
//         }
//     };

//     const handleSendGroupMessage = async (socket, data, io) => {
//         try {
//             const { groupId, content, messageType = 'text' } = data;
//             const senderId = socket.userId;

//             // Validate data
//             if (!groupId || !content) {
//                 socket.emit('message_error', { error: 'Group ID and content are required' });
//                 return;
//             }

//             // Validate group membership
//             const group = await groupModel.findById(groupId);
//             if (!group || !group.members.includes(senderId)) {
//                 socket.emit('group_error', { error: 'You are not a member of this group' });
//                 return;
//             }

//             // Save message to database
//             const newMessage = await messageModel.create({
//                 sender: senderId,
//                 group: groupId,
//                 content,
//                 messageType,
//                 chatType: 'group',
//                 timestamp: new Date(),
//                 readBy: [senderId] // Sender has "read" their own message
//             });

//             // Populate sender info
//             await newMessage.populate('sender', 'name personalEmail avatar');

//             const messageData = {
//                 _id: newMessage._id,
//                 sender: {
//                     _id: newMessage.sender._id,
//                     name: newMessage.sender.name,
//                     avatar: newMessage.sender.avatar
//                 },
//                 group: groupId,
//                 content: newMessage.content,
//                 messageType: newMessage.messageType,
//                 timestamp: newMessage.timestamp,
//                 chatType: 'group',
//                 readBy: [senderId]
//             };

//             // Send to all group members
//             io.to(`group_${groupId}`).emit('new_group_message', messageData);

//             console.log(`👥 Group message sent by ${socket.userInfo.name} in group ${groupId}`);

//         } catch (error) {
//             console.error('❌ Error sending group message:', error);
//             socket.emit('message_error', { error: 'Failed to send group message' });
//         }
//     };

//     const handleMarkMessageRead = async (socket, data, io) => {
//         try {
//             const { messageId, senderId } = data;
//             const readerId = socket.userId;

//             // Update message read status
//             const message = await messageModel.findByIdAndUpdate(
//                 messageId,
//                 { 
//                     isRead: true,
//                     readAt: new Date()
//                 },
//                 { new: true }
//             );

//             if (!message) {
//                 socket.emit('message_error', { error: 'Message not found' });
//                 return;
//             }

//             // Notify sender that message was read
//             if (isUserOnline(senderId)) {
//                 sendToUser(senderId, 'message_read', {
//                     messageId,
//                     readerId,
//                     readerInfo: socket.userInfo,
//                     readAt: new Date()
//                 }, io);
//             }

//             console.log(`👁️ Message ${messageId} marked as read by ${socket.userInfo.name}`);

//         } catch (error) {
//             console.error('❌ Error marking message as read:', error);
//             socket.emit('message_error', { error: 'Failed to mark message as read' });
//         }
//     };

//     const handleGetOnlineUsers = (socket, io) => {
//         const currentOnlineUsers = Array.from(userProfiles.entries()).map(([userId, profile]) => ({
//             userId,
//             userInfo: {
//                 name: profile.name,
//                 avatar: profile.avatar
//             },
//             status: 'online'
//         }));

//         socket.emit('online_users_list', {
//             users: currentOnlineUsers,
//             count: currentOnlineUsers.length,
//             timestamp: new Date()
//         });
//     };

//     const handleUpdateUserStatus = (socket, data, io) => {
//         const { status } = data;
//         const userId = socket.userId;
//         const userInfo = socket.userInfo;

//         // Update user profile cache
//         if (userProfiles.has(userId)) {
//             userProfiles.set(userId, {
//                 ...userProfiles.get(userId),
//                 status
//             });
//         }

//         // Broadcast status update
//         socket.broadcast.emit('user_status_updated', {
//             userId,
//             status,
//             userInfo: {
//                 name: userInfo.name,
//                 avatar: userInfo.avatar
//             },
//             timestamp: new Date()
//         });

//         console.log(`📊 User ${userInfo.name} status updated to: ${status}`);
//     };

//     const handleTypingStart = (socket, data, io) => {
//         const { roomId } = data;
//         const userId = socket.userId;

//         socket.to(roomId).emit('user_typing_start', {
//             userId: userId,
//             userInfo: socket.userInfo,
//             roomId,
//             timestamp: new Date()
//         });
//     };

//     const handleTypingStop = (socket, data, io) => {
//         const { roomId } = data;
//         const userId = socket.userId;

//         socket.to(roomId).emit('user_typing_stop', {
//             userId: userId,
//             roomId,
//             timestamp: new Date()
//         });
//     };
// };

// // Utility functions
// const isUserOnline = (userId) => {
//     return onlineUsers.has(userId) && onlineUsers.get(userId).size > 0;
// };

// const sendToUser = (userId, event, data, io) => {
//     if (isUserOnline(userId)) {
//         const userSockets = onlineUsers.get(userId);
//         userSockets.forEach(socketId => {
//             io.to(socketId).emit(event, data);
//         });
//         return true;
//     }
//     return false;
// };

// const getOnlineUsersCount = () => {
//     return onlineUsers.size;
// };

// const broadcastOnlineUsers = (io) => {
//     const currentOnlineUsers = Array.from(userProfiles.entries()).map(([userId, profile]) => ({
//         userId,
//         userInfo: {
//             name: profile.name,
//             avatar: profile.avatar
//         },
//         status: 'online'
//     }));
    
//     io.emit('online_users_updated', {
//         users: currentOnlineUsers,
//         count: currentOnlineUsers.length,
//         timestamp: new Date()
//     });
// };

// // API utilities for other controllers
// export const socketUtils = {
//     isUserOnline,
//     sendToUser,
//     getOnlineUsersCount,
//     broadcastOnlineUsers,
//     getOnlineUsers: () => Array.from(onlineUsers.keys())
// };

// export default socketController;