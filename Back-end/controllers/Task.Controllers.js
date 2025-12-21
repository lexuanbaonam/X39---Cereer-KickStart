import taskModel from "../models/Tasks.Models.js";
import sprintModel from "../models/Sprints.Models.js";
import userModel from "../models/Users.Models.js";
import mongoose from 'mongoose';

const taskController = {
    // Create a new task (Admin/Leader permission required)
    createTask: async (req, res) => {
        try {
            const { departId, sprintId, title, description, priority, assignees, duration, startDate, endDate, estimatedHours } = req.body;

            if (!departId || !title) {
                return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin: departId, title." });
            }

            // Find user profile from account
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Validate sprint if provided
            if (sprintId) {
                if (!mongoose.Types.ObjectId.isValid(sprintId)) {
                    return res.status(400).json({ message: "ID sprint không hợp lệ." });
                }
                const sprint = await sprintModel.findById(sprintId);
                if (!sprint) {
                    return res.status(404).json({ message: "Sprint không tồn tại." });
                }
            }

            // Validate and process assignees
            let processedAssignees = [];
            if (assignees) {
                if (Array.isArray(assignees)) {
                    for (const assigneeId of assignees) {
                        if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
                            return res.status(400).json({ message: `ID người được giao việc không hợp lệ: ${assigneeId}` });
                        }
                        const assignee = await userModel.findById(assigneeId);
                        if (!assignee) {
                            return res.status(404).json({ message: `Không tìm thấy người dùng với ID: ${assigneeId}` });
                        }
                        // 🚫 MEMBER cannot assign tasks to leaders/admins
                        if (req.account.roleTag === 'MEMBER' && ['ADMIN', 'LEADER'].includes(assignee.roleTag)) {
                            return res.status(403).json({ message: "Nhân viên không thể giao việc cho quản trị viên hoặc trưởng nhóm." });
                        }
                        processedAssignees.push(assigneeId);
                    }
                } else {
                    if (!mongoose.Types.ObjectId.isValid(assignees)) {
                        return res.status(400).json({ message: "ID người được giao việc không hợp lệ." });
                    }
                    const assignee = await userModel.findById(assignees);
                    if (!assignee) {
                        return res.status(404).json({ message: "Không tìm thấy người được giao việc." });
                    }
                    if (req.account.roleTag === 'MEMBER' && ['ADMIN', 'LEADER'].includes(assignee.roleTag)) {
                        return res.status(403).json({ message: "Nhân viên không thể giao việc cho quản trị viên hoặc trưởng nhóm." });
                    }
                    processedAssignees.push(assignees);
                }
            } else {
                // Default to current user if no assignees provided
                processedAssignees.push(userProfile._id);
            }

            // MEMBER can only assign to themselves or other MEMBER
            if (req.account.role === 'MEMBER') {
                // Check if all assignees are MEMBER or self
                for (const assigneeId of processedAssignees) {
                    const assignee = await userModel.findById(assigneeId);
                    if (['ADMIN', 'LEADER'].includes(assignee.roleTag)) {
                        return res.status(403).json({ message: "Nhân viên chỉ có thể giao việc cho nhân viên khác hoặc bản thân." });
                    }
                }
            }

            const taskData = {
                departId,
                sprintId,
                title,
                description,
                priority: priority || 'MEDIUM',
                duration: duration || 0,
                assignees: processedAssignees,
                status: 'NOTSTARTED',
                createdBy: userProfile._id,
                estimatedHours: estimatedHours || 0
            };

            if (startDate) taskData.startDate = new Date(startDate);
            if (endDate) taskData.endDate = new Date(endDate);

            const newTask = await taskModel.create(taskData);

            const populatedTask = await taskModel.findById(newTask._id)
                .populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail')
                .populate('sprintId', 'title status startDate endDate')
                .populate('departId', 'name');

            res.status(201).json({
                message: "Tạo công việc mới thành công",
                task: populatedTask
            });
        } catch (err) {
            console.error('❌ Create task error:', err);
            res.status(500).json({ message: "Lỗi khi tạo công việc", error: err.message });
        }
    },

    // Get all tasks (Admin only)
    getAllTasks: async (req, res) => {
        try {
            const { page = 1, limit = 10, sprintId, status, priority, search, assigneeId } = req.query;

            // Build filter
            const filter = {};

            if (sprintId && mongoose.Types.ObjectId.isValid(sprintId)) {
                filter.sprintId = sprintId;
            }

            if (status) {
                filter.status = status;
            }

            if (priority) {
                filter.priority = priority;
            }

            if (assigneeId && mongoose.Types.ObjectId.isValid(assigneeId)) {
                filter.assignees = assigneeId;
            }

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const tasks = await taskModel.find(filter)
                .populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail')
                .populate('sprintId', 'title status startDate endDate')
                .populate('departId', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await taskModel.countDocuments(filter);

            res.status(200).json({
                message: "Lấy danh sách công việc thành công",
                tasks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (err) {
            console.error('❌ Get all tasks error:', err);
            res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error: err.message });
        }
    },

    // Get tasks for current user
    getMyTasks: async (req, res) => {
        try {
            const { page = 1, limit = 10, sprintId, status, priority } = req.query;

            // Find user profile
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Build filter for user's tasks
            const filter = {
                $or: [
                    { createdBy: userProfile._id },
                    { assignees: { $in: [userProfile._id] } } // Changed to check if user is in assignees array
                ]
            };

            if (sprintId && mongoose.Types.ObjectId.isValid(sprintId)) {
                filter.sprintId = sprintId;
            }

            if (status) {
                filter.status = status;
            }

            if (priority) {
                filter.priority = priority;
            }

            const tasks = await taskModel.find(filter)
                .populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail')
                .populate('sprintId', 'title status startDate endDate')
                .populate('departId', 'name')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await taskModel.countDocuments(filter);

            res.status(200).json({
                message: "Lấy danh sách công việc cá nhân thành công",
                tasks,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (err) {
            console.error('❌ Get my tasks error:', err);
            res.status(500).json({ message: "Lỗi khi lấy danh sách công việc", error: err.message });
        }
    },

    // Get task by ID
    getTaskById: async (req, res) => {
        try {
            const { taskId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                return res.status(400).json({ message: "ID task không hợp lệ." });
            }

            const task = await taskModel.findById(taskId)
                .populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail')
                .populate('sprintId', 'title status startDate endDate')
                .populate('departId', 'name');

            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission - fixed to check assignees array
            const isAssigned = task.assignees.some(assignee => assignee._id.equals(userProfile._id));
            const canView = req.account.role === 'ADMIN' ||
                task.createdBy._id.equals(userProfile._id) ||
                isAssigned;

            if (!canView) {
                return res.status(403).json({ message: "Bạn không có quyền xem task này." });
            }

            res.status(200).json({
                message: "Lấy thông tin công việc thành công",
                task
            });
        } catch (err) {
            console.error('❌ Get task by ID error:', err);
            res.status(500).json({ message: "Lỗi khi lấy thông tin công việc", error: err.message });
        }
    },

    // Update task (Admin permission required)
    updateTask: async (req, res) => {
        try {
            const { taskId } = req.params;
            const { title, description, status, priority, duration, assignees, startDate, endDate, estimatedHours, completionPercentage } = req.body;

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                return res.status(400).json({ message: "ID task không hợp lệ." });
            }

            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission - Only admin or creator can update
            const canEdit = req.account.role === 'ADMIN' || task.createdBy.equals(userProfile._id);

            if (!canEdit) {
                return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa task này." });
            }

            // Build update data
            const updateData = {};
            if (title) updateData.title = title;
            if (description) updateData.description = description;
            if (status) updateData.status = status;
            if (priority) updateData.priority = priority;
            if (duration !== undefined) updateData.duration = duration;
            if (estimatedHours !== undefined) updateData.estimatedHours = estimatedHours;
            if (completionPercentage !== undefined) updateData.completionPercentage = completionPercentage;
            if (startDate) updateData.startDate = new Date(startDate);
            if (endDate) updateData.endDate = new Date(endDate);

            // Handle assignees update
            if (assignees) {
                let processedAssignees = [];

                if (Array.isArray(assignees)) {
                    // Multiple assignees
                    for (const assigneeId of assignees) {
                        if (!mongoose.Types.ObjectId.isValid(assigneeId)) {
                            return res.status(400).json({ message: `ID người được giao việc không hợp lệ: ${assigneeId}` });
                        }

                        const assignee = await userModel.findById(assigneeId);
                        if (!assignee) {
                            return res.status(404).json({ message: `Không tìm thấy người dùng với ID: ${assigneeId}` });
                        }

                        processedAssignees.push(assigneeId);
                    }
                } else {
                    // Single assignee
                    if (!mongoose.Types.ObjectId.isValid(assignees)) {
                        return res.status(400).json({ message: "ID người được giao việc không hợp lệ." });
                    }

                    const assignee = await userModel.findById(assignees);
                    if (!assignee) {
                        return res.status(404).json({ message: "Không tìm thấy người được giao việc." });
                    }

                    processedAssignees.push(assignees);
                }

                updateData.assignees = processedAssignees;
            }

            // Validate dates if both are provided
            if (updateData.startDate && updateData.endDate && updateData.startDate >= updateData.endDate) {
                return res.status(400).json({ message: "Ngày bắt đầu phải trước ngày kết thúc." });
            }

            const updatedTask = await taskModel.findByIdAndUpdate(
                taskId,
                updateData,
                { new: true, runValidators: true }
            ).populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail')
                .populate('sprintId', 'title status startDate endDate')
                .populate('departId', 'name');

            res.status(200).json({
                message: "Cập nhật công việc thành công",
                task: updatedTask
            });
        } catch (err) {
            console.error('❌ Update task error:', err);
            res.status(500).json({ message: "Lỗi khi cập nhật công việc", error: err.message });
        }
    },

    // Delete task (Admin permission required)
    deleteTask: async (req, res) => {
        try {
            const { taskId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                return res.status(400).json({ message: "ID task không hợp lệ." });
            }

            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission (only creator or admin can delete)
            const canDelete = req.account.role === 'ADMIN' || task.createdBy.equals(userProfile._id);

            if (!canDelete) {
                return res.status(403).json({ message: "Bạn không có quyền xóa task này." });
            }

            await taskModel.findByIdAndDelete(taskId);

            res.status(200).json({
                message: "Xóa công việc thành công",
                deletedTask: {
                    id: task._id,
                    title: task.title,
                    assigneesCount: task.assignees.length
                }
            });
        } catch (err) {
            console.error('❌ Delete task error:', err);
            res.status(500).json({ message: "Lỗi khi xóa công việc", error: err.message });
        }
    },

    // Submit task (Assignees can submit)
    submitTask: async (req, res) => {
        try {
            const { taskId } = req.params;
            const { documentTransfer, feedback } = req.body;

            if (!mongoose.Types.ObjectId.isValid(taskId)) {
                return res.status(400).json({ message: "ID task không hợp lệ." });
            }

            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Find user profile
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check if user is assigned to this task
            const isAssigned = task.assignees.some(assigneeId => assigneeId.equals(userProfile._id));
            if (!isAssigned) {
                return res.status(403).json({ message: "Bạn không được giao việc này." });
            }

            // Update task with submission
            const updatedTask = await taskModel.findByIdAndUpdate(
                taskId,
                {
                    'submission.documentTransfer': documentTransfer,
                    'submission.submittedBy': userProfile._id,
                    'submission.submittedAt': new Date(),
                    'submission.feedback': feedback,
                    status: 'COMPLETED'
                },
                { new: true }
            ).populate('createdBy', 'name personalEmail')
                .populate('assignees', 'name personalEmail')
                .populate('submission.submittedBy', 'name personalEmail');

            res.status(200).json({
                message: "Nộp bài thành công",
                task: updatedTask
            });
        } catch (err) {
            console.error('❌ Submit task error:', err);
            res.status(500).json({ message: "Lỗi khi nộp bài", error: err.message });
        }
    },

    // Add assignee to task (Admin only)
    addAssignee: async (req, res) => {
        try {
            const { taskId } = req.params;
            const { assigneeId } = req.body;

            if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(assigneeId)) {
                return res.status(400).json({ message: "ID không hợp lệ." });
            }

            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            const assignee = await userModel.findById(assigneeId);
            if (!assignee) {
                return res.status(404).json({ message: "Không tìm thấy người dùng." });
            }

            // Check if already assigned
            if (task.assignees.includes(assigneeId)) {
                return res.status(400).json({ message: "Người dùng đã được giao việc này." });
            }

            // Add assignee
            task.assignees.push(assigneeId);
            await task.save();

            const updatedTask = await taskModel.findById(taskId)
                .populate('assignees', 'name personalEmail')
                .populate('createdBy', 'name personalEmail');

            res.status(200).json({
                message: "Thêm người thực hiện thành công",
                task: updatedTask
            });
        } catch (err) {
            console.error('❌ Add assignee error:', err);
            res.status(500).json({ message: "Lỗi khi thêm người thực hiện", error: err.message });
        }
    },

    // Remove assignee from task (Admin only)
    removeAssignee: async (req, res) => {
        try {
            const { taskId, assigneeId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(taskId) || !mongoose.Types.ObjectId.isValid(assigneeId)) {
                return res.status(400).json({ message: "ID không hợp lệ." });
            }

            const task = await taskModel.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Không tìm thấy công việc." });
            }

            // Check if assignee exists in task
            if (!task.assignees.includes(assigneeId)) {
                return res.status(400).json({ message: "Người dùng không được giao việc này." });
            }

            // Remove assignee
            task.assignees = task.assignees.filter(id => !id.equals(assigneeId));
            await task.save();

            const updatedTask = await taskModel.findById(taskId)
                .populate('assignees', 'name personalEmail')
                .populate('createdBy', 'name personalEmail');

            res.status(200).json({
                message: "Xóa người thực hiện thành công",
                task: updatedTask
            });
        } catch (err) {
            console.error('❌ Remove assignee error:', err);
            res.status(500).json({ message: "Lỗi khi xóa người thực hiện", error: err.message });
        }
    }
};

export default taskController;