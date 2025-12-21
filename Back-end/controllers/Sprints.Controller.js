import sprintModel from "../models/Sprints.Models.js";
import userModel from "../models/Users.Models.js"; // Import user model
import mongoose from 'mongoose';

const sprintController = {
    createSprint: async (req, res) => {
        try {
            const { title, description, startDate, endDate, projectId, teamMembers } = req.body;

            // Validate required fields
            if (!title || !startDate || !endDate) {
                return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin: title, startDate, endDate." });
            }

            // Get today's date (start of day) for comparison
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const start = new Date(startDate);
            const end = new Date(endDate);

            // Validate date formats
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                return res.status(400).json({ message: "Định dạng ngày không hợp lệ. Sử dụng format YYYY-MM-DD." });
            }

            // Set dates to start of day for fair comparison
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);

            // Validate that start date is not in the past
            if (start < today) {
                return res.status(400).json({ 
                    message: `Ngày bắt đầu không thể là ngày trong quá khứ. Ngày bắt đầu phải từ ${today.toLocaleDateString('vi-VN')} trở về sau.`,
                    todayDate: today.toISOString().split('T')[0],
                    providedStartDate: startDate
                });
            }

            // Validate that end date is not in the past
            if (end < today) {
                return res.status(400).json({ 
                    message: `Ngày kết thúc không thể là ngày trong quá khứ. Ngày kết thúc phải từ ${today.toLocaleDateString('vi-VN')} trở về sau.`,
                    todayDate: today.toISOString().split('T')[0],
                    providedEndDate: endDate
                });
            }

            // Validate that end date is after start date
            if (end <= start) {
                return res.status(400).json({ 
                    message: "Ngày kết thúc phải sau ngày bắt đầu.",
                    description: description ? description : "",
                    startDate,
                    endDate
                });
            }

            // Find the user profile for the admin creating this sprint
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ 
                    message: "Không tìm thấy profile người dùng. Vui lòng tạo profile trước khi tạo sprint." 
                });
            }

            // Validate projectId if provided
            if (projectId && !mongoose.Types.ObjectId.isValid(projectId)) {
                return res.status(400).json({ message: "ID dự án không hợp lệ." });
            }

            // Create sprint data with correct field names
            const newSprint = await sprintModel.create({
                createdBy: userProfile._id, // Use user profile ID
                title,
                description,
                startDate: start,
                endDate: end,
                status: 'NOTSTARTED', // Default status
                projectId: projectId ? mongoose.Types.ObjectId(projectId) : null, // Convert to ObjectId if provided
                teamMembers: teamMembers ? teamMembers.map(id => mongoose.Types.ObjectId(id)) : [] // Convert to ObjectIds
            })

            await newSprint.save();

            res.status(201).json({ 
                message: "Tạo sprint thành công", 
                sprint: newSprint,
                validation: {
                    todayDate: today.toISOString().split('T')[0],
                    duration: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + " ngày",
                    owner: userProfile.name
                }
            });
        } catch (err) {
            console.error('❌ Create sprint error:', err);
            res.status(500).json({ message: "Lỗi khi tạo sprint", error: err.message });
        }
    },

    getSprint: async (req, res) => {
        try {
            const { page = 1, limit = 10, status, projectId, search } = req.query;
            
            // Build filter
            const filter = {};
            
            // Find user profile for filtering
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }
            
            // Filter by user (user can only see their own sprints unless admin)
            if (req.account.role !== 'ADMIN') {
                filter.user = userProfile._id;
            }
            
            if (status) {
                filter.status = status;
            }
            
            if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
                filter.projectId = mongoose.Types.ObjectId(projectId);
            }
            
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const sprints = await sprintModel.find(filter)
                .populate('createdBy', 'name personalEmail')
                .populate('projectId', 'title')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await sprintModel.countDocuments(filter);

            // Add status indicators for each sprint
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const sprintsWithStatus = sprints.map(sprint => {
                const sprintObj = sprint.toObject();
                const startDate = new Date(sprint.startDate);
                const endDate = new Date(sprint.endDate);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);

                // Calculate sprint timeline status based on Vietnamese enum
                if (sprint.status === 'Hoàn thành') {
                    sprintObj.timelineStatus = 'COMPLETED';
                } else if (today < startDate) {
                    sprintObj.timelineStatus = 'UPCOMING';
                } else if (today >= startDate && today <= endDate) {
                    sprintObj.timelineStatus = 'ACTIVE';
                } else {
                    sprintObj.timelineStatus = 'OVERDUE';
                }

                return sprintObj;
            });

            res.status(200).json({
                message: "Lấy danh sách sprint thành công",
                sprints: sprintsWithStatus,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (err) {
            console.error('❌ Get sprints error:', err);
            res.status(500).json({ message: "Lỗi khi lấy danh sách sprint", error: err.message });
        }
    },
    getSprintById: async (req, res) => {
        try {
            const { sprintId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(sprintId)) {
                return res.status(400).json({ message: "ID sprint không hợp lệ." });
            }

            const sprint = await sprintModel.findById(sprintId)
                .populate('user', 'name personalEmail')
                .populate('projectId', 'title');

            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check if user has permission to view this sprint
            if (req.account.role !== 'ADMIN' && !sprint.user._id.equals(userProfile._id)) {
                return res.status(403).json({ message: "Bạn không có quyền xem sprint này." });
            }

            res.status(200).json({
                message: "Lấy thông tin sprint thành công",
                sprint
            });
        } catch (err) {
            console.error('❌ Get sprint by ID error:', err);
            res.status(500).json({ message: "Lỗi khi lấy thông tin sprint", error: err.message });
        }
    },
    getSprintsByStaffId: async (req, res) => {
        try {
            const { staffId } = req.params
            const { page = 1, limit = 10 } = req.query;
            const userProfile = await userModel.findOne({ userId: req.account.staffId });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            const sprints = await sprintModel.find({ createdBy: staffId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            const total = await sprintModel.countDocuments({ createdBy: staffId });
            res.status(200).json({
                message: "Lấy danh sách sprint của nhân viên thành công",
                sprints,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('❌ Get sprints by staff ID error:', error);
            res.status(500).json({ message: "Lỗi khi lấy danh sách sprint của nhân viên", error: error.message });
        }
    },
    updateSprint: async (req, res) => {
        try {
            const { sprintId } = req.params;
            const { title, description, startDate, endDate, status } = req.body;

            if (!mongoose.Types.ObjectId.isValid(sprintId)) {
                return res.status(400).json({ message: "ID sprint không hợp lệ." });
            }

            const sprint = await sprintModel.findById(sprintId);
            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission
            if (req.account.role !== 'ADMIN' && !sprint.user.equals(userProfile._id)) {
                return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa sprint này." });
            }

            // Validate status if provided
            if (status && !['Chưa bắt đầu', 'Đang làm', 'Hoàn thành'].includes(status)) {
                return res.status(400).json({ 
                    message: "Trạng thái không hợp lệ. Chỉ chấp nhận: 'Chưa bắt đầu', 'Đang làm', 'Hoàn thành'" 
                });
            }

            // If dates are being updated, validate them
            if (startDate || endDate) {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const newStartDate = startDate ? new Date(startDate) : sprint.startDate;
                const newEndDate = endDate ? new Date(endDate) : sprint.endDate;

                newStartDate.setHours(0, 0, 0, 0);
                newEndDate.setHours(0, 0, 0, 0);

                // Only validate future dates if sprint hasn't started yet
                const currentStartDate = new Date(sprint.startDate);
                currentStartDate.setHours(0, 0, 0, 0);

                if (currentStartDate >= today && sprint.status === 'Chưa bắt đầu') {
                    // Sprint hasn't started, apply date validation
                    if (newStartDate < today) {
                        return res.status(400).json({ 
                            message: `Ngày bắt đầu không thể là ngày trong quá khứ. Phải từ ${today.toLocaleDateString('vi-VN')} trở về sau.`
                        });
                    }

                    if (newEndDate < today) {
                        return res.status(400).json({ 
                            message: `Ngày kết thúc không thể là ngày trong quá khứ. Phải từ ${today.toLocaleDateString('vi-VN')} trở về sau.`
                        });
                    }
                }

                if (newEndDate <= newStartDate) {
                    return res.status(400).json({ message: "Ngày kết thúc phải sau ngày bắt đầu." });
                }
            }

            // Update sprint
            const updateData = {};
            if (title) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (startDate) updateData.startDate = new Date(startDate);
            if (endDate) updateData.endDate = new Date(endDate);
            if (status) updateData.status = status;

            const updatedSprint = await sprintModel.findByIdAndUpdate(
                sprintId,
                updateData,
                { new: true, runValidators: true }
            ).populate('user', 'name personalEmail')
             .populate('projectId', 'title');

            res.status(200).json({ 
                message: "Cập nhật sprint thành công", 
                sprint: updatedSprint 
            });
        } catch (err) {
            console.error('❌ Update sprint error:', err);
            res.status(500).json({ message: "Lỗi khi cập nhật sprint", error: err.message });
        }
    },
    completeSprint: async (req, res) => {
        try {
            const { sprintId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(sprintId)) {
                return res.status(400).json({ message: "ID sprint không hợp lệ." });
            }

            const sprint = await sprintModel.findById(sprintId);
            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission
            if (req.account.role !== 'ADMIN' && !sprint.user.equals(userProfile._id)) {
                return res.status(403).json({ message: "Bạn không có quyền hoàn thành sprint này." });
            }

            // Check if sprint is already completed
            if (sprint.status === 'Hoàn thành') {
                return res.status(400).json({ message: "Sprint đã được hoàn thành trước đó." });
            }

            // Update sprint status to completed
            sprint.status = 'Hoàn thành';
            await sprint.save();

            const populatedSprint = await sprintModel.findById(sprintId)
                .populate('user', 'name personalEmail')
                .populate('projectId', 'title');

            res.status(200).json({ 
                message: "Hoàn thành sprint thành công.", 
                sprint: populatedSprint 
            });
        } catch (err) {
            console.error('❌ Complete sprint error:', err);
            res.status(500).json({ message: "Lỗi khi hoàn thành sprint", error: err.message });
        }
    },

    deleteSprint: async (req, res) => {
        try {
            const { sprintId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(sprintId)) {
                return res.status(400).json({ message: "ID sprint không hợp lệ." });
            }

            const sprint = await sprintModel.findById(sprintId);
            if (!sprint) {
                return res.status(404).json({ message: "Sprint không tồn tại." });
            }

            // Find user profile for permission check
            const userProfile = await userModel.findOne({ accountId: req.account._id });
            if (!userProfile) {
                return res.status(404).json({ message: "Không tìm thấy profile người dùng." });
            }

            // Check permission
            if (req.account.role !== 'ADMIN' && !sprint.user.equals(userProfile._id)) {
                return res.status(403).json({ message: "Bạn không có quyền xóa sprint này." });
            }

            // Check if sprint has started
            const today = new Date();
            const startDate = new Date(sprint.startDate);
            today.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);

            if (startDate <= today && sprint.status !== 'Chưa bắt đầu') {
                return res.status(400).json({ 
                    message: "Không thể xóa sprint đã bắt đầu hoặc đã hoàn thành. Chỉ có thể xóa sprint chưa bắt đầu." 
                });
            }

            await sprintModel.findByIdAndDelete(sprintId);
            
            res.status(200).json({ 
                message: "Xóa sprint thành công.",
                deletedSprint: {
                    id: sprint._id,
                    title: sprint.title
                }
            });
        } catch (err) {
            console.error('❌ Delete sprint error:', err);
            res.status(500).json({ message: "Lỗi khi xóa sprint", error: err.message });
        }
    }
}

export default sprintController;