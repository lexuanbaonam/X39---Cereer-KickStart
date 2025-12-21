import TaskModel from '../models/Tasks.Models.js';
import UserModel from '../models/Users.Models.js';

//  Lấy danh sách tất cả timeline task của mọi người (Admin)
export const getAllTimelineTasks = async (req, res) => {
    try {
        const tasks = await TaskModel.find().populate('assignees', 'fullName email');
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi lấy danh sách timeline tasks', error });
    }
};

//Thêm timeline task
export const addTimelineTask = async (req, res) => {
    try {
        const { title, description, assignees, startDate, endDate } = req.body;

        const users = await UserModel.find({ _id: { $in: assignees } });
        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        const newTask = await TaskModel.create({
            title,
            description,
            assignees,
            startDate,
            endDate,
            createdBy: req.user._id,
        });

        // Tạo nhiều task cho các thành viên
        const createdTasks = await Promise.all(
            assignedTo.map(userId =>
                TaskModel.create({
                    title,
                    description,
                    assignedTo: userId,
                    startDate,
                    endDate,
                    createdBy: req.user._id, // Admin tạo
                })
            )
        );

        res.status(201).json({ success: true, message: 'Đã tạo task cho nhóm thành công', data: createdTasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể thêm timeline task', error });
    }
};

// Cập nhật timeline task
export const updateTimelineTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const task = await TaskModel.findByIdAndUpdate(id, updates, { new: true });
        if (!task) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy task' });
        }

        res.status(200).json({ success: true, message: 'Cập nhật task thành công', data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể cập nhật task', error });
    }
};

// Xóa timeline task
export const deleteTimelineTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await TaskModel.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy task để xóa' });
        }

        res.status(200).json({ success: true, message: 'Xóa task thành công' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi khi xóa task', error });
    }
};

// Lấy timeline task của một người dùng cụ thể
export const getTimelineTasksByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Người dùng không tồn tại' });
        }

        const tasks = await TaskModel.find({ assignedTo: userId }).populate('assignees', 'fullName email');

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Không thể lấy timeline task cho người dùng này', error });
    }
};
