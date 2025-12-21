import express from 'express';
import userController from '../controllers/Users.Controllers.js';
import { authVerify, authenticateToken } from '../middlewares/Auth.Middlewares.js';

const userRouter = express.Router();

// User routes - for authenticated users to manage their own profile
userRouter.get('/me', authenticateToken, userController.getMyProfile);                    // Get current user's profile
userRouter.post('/create-profile', authenticateToken, userController.createMyProfile);   // Create user profile for first time
userRouter.put('/me', authenticateToken, userController.updateMyProfile);                // Update current user's profile

// Admin routes - for admin to manage all users
userRouter.get('/all', authVerify, userController.getAllUsers);                   // Get all users (admin only)
userRouter.get('/:userId', authVerify, userController.getUserById);               // Get user by ID (admin only)
userRouter.put('/:userId', authVerify, userController.updateUserById);            // Update user by ID (admin only)

export default userRouter;
