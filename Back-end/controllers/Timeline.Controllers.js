import TasksModels from "../models/Tasks.Models.js";
import SprintsModels from "../models/Sprints.Models.js";
import TimelineModels from "../models/Timeline.Models.js";
// import CoursesModels from "../models/Courses.Models.js";

import mongoose from 'mongoose';

const timelineController = {
    // AD-QLTT04: Tạo biểu đồ timeline
    createTimeline: async (req, res) => {
        try {
            const { 
                title, 
                description, 
                type, // PROJECT, SPRINT, TASK
                startDate, 
                endDate,
                projectId,
                sprintId,
                tasks = []
            } = req.body;

            // Validate required fields
            if (!title || !startDate || !endDate) {
                return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin timeline.' });
            }

            if (new Date(startDate) >= new Date(endDate)) {
                return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu.' });
            }

            let timelineData = {
                title,
                description,
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                createdBy: req.account._id
            };

            // Add project or sprint reference
            if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
                timelineData.projectId = mongoose.Types.ObjectId(projectId);
            }

            if (sprintId && mongoose.Types.ObjectId.isValid(sprintId)) {
                timelineData.sprintId = mongoose.Types.ObjectId(sprintId);
            }

            // Add tasks to timeline
            if (tasks.length > 0) {
                timelineData.tasks = tasks.map(task => ({
                    taskId: mongoose.Types.ObjectId(task.taskId),
                    title: task.title,
                    startDate: new Date(task.startDate),
                    endDate: new Date(task.endDate),
                    status: task.status || 'PENDING',
                    assignees: task.assignees ? task.assignees.map(id => mongoose.Types.ObjectId(id)) : [],
                    dependencies: task.dependencies || [],
                    milestone: task.milestone || false
                }));
            }

            // Create timeline using your Timeline model
            const timeline = await TimelineModels.create(timelineData);

            res.status(201).json({
                message: 'Timeline đã được tạo thành công',
                timeline
            });
        } catch (error) {
            console.error('❌ Create timeline error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // AD-QLTT04: Cập nhật timeline
    updateTimeline: async (req, res) => {
        try {
            const { timelineId } = req.params;
            const updateData = req.body;

            if (!mongoose.Types.ObjectId.isValid(timelineId)) {
                return res.status(400).json({ message: 'ID timeline không hợp lệ.' });
            }

            // Check if timeline exists
            const existingTimeline = await TimelineModels.findById(timelineId);
            if (!existingTimeline) {
                return res.status(404).json({ message: 'Timeline không tồn tại.' });
            }

            // Validate dates if provided
            if (updateData.startDate && updateData.endDate) {
                if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
                    return res.status(400).json({ message: 'Ngày kết thúc phải sau ngày bắt đầu.' });
                }
            }

            // Process task updates
            if (updateData.tasks) {
                updateData.tasks = updateData.tasks.map(task => ({
                    ...task,
                    taskId: mongoose.Types.ObjectId(task.taskId),
                    startDate: new Date(task.startDate),
                    endDate: new Date(task.endDate),
                    assignees: task.assignees ? task.assignees.map(id => mongoose.Types.ObjectId(id)) : []
                }));
            }

            // Convert date strings to Date objects
            if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
            if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

            updateData.updatedBy = req.account._id;

            // Update timeline in database
            const updatedTimeline = await TimelineModels.findByIdAndUpdate(
                timelineId,
                updateData,
                { new: true, runValidators: true }
            ).populate(['projectId', 'sprintId', 'createdBy', 'updatedBy']);

            res.status(200).json({
                message: 'Timeline đã được cập nhật thành công',
                timeline: updatedTimeline
            });
        } catch (error) {
            console.error('❌ Update timeline error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // AD-QLTT04: Xem timeline task
    getTaskTimeline: async (req, res) => {
        try {
            const { timelineId, projectId, sprintId, startDate, endDate, view = 'gantt' } = req.query;

            let timelineData;

            if (timelineId && mongoose.Types.ObjectId.isValid(timelineId)) {
                // Get specific timeline
                const timeline = await TimelineModels.findById(timelineId)
                    .populate(['projectId', 'sprintId', 'createdBy']);

                if (!timeline) {
                    return res.status(404).json({ message: 'Timeline không tồn tại.' });
                }

                // Get tasks from timeline
                const taskIds = timeline.tasks.map(t => t.taskId);
                const tasksDetails = await TasksModels.find({ _id: { $in: taskIds } })
                    .populate('assignees', 'name personalEmail')
                    .populate('sprintId', 'title');

                // Merge timeline task info with actual task details
                timelineData = timeline.tasks.map(timelineTask => {
                    const taskDetail = tasksDetails.find(t => t._id.equals(timelineTask.taskId));
                    return {
                        _id: timelineTask.taskId,
                        title: timelineTask.title,
                        description: taskDetail?.description || '',
                        status: timelineTask.status,
                        priority: taskDetail?.priority || 'MEDIUM',
                        startDate: timelineTask.startDate,
                        dueDate: timelineTask.endDate,
                        duration: this.calculateDuration(timelineTask.startDate, timelineTask.endDate),
                        progress: this.getProgressByStatus(timelineTask.status),
                        milestone: timelineTask.milestone,
                        dependencies: timelineTask.dependencies,
                        assignees: taskDetail?.assignees ? taskDetail.assignees.map(assignee => ({
                            _id: assignee._id,
                            name: assignee.name,
                            personalEmail: assignee.personalEmail
                        })) : [],
                        sprint: taskDetail?.sprintId ? {
                            _id: taskDetail.sprintId._id,
                            title: taskDetail.sprintId.title
                        } : null,
                        timeline: {
                            _id: timeline._id,
                            title: timeline.title,
                            type: timeline.type
                        }
                    };
                });

            } else {
                // Build filters for general task timeline
                const matchFilter = {};
                
                if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
                    const sprints = await SprintsModels.find({ courseId: mongoose.Types.ObjectId(projectId) });
                    const sprintIds = sprints.map(s => s._id);
                    matchFilter.sprintId = { $in: sprintIds };
                } else if (sprintId && mongoose.Types.ObjectId.isValid(sprintId)) {
                    matchFilter.sprintId = mongoose.Types.ObjectId(sprintId);
                }

                if (startDate && endDate) {
                    matchFilter.$or = [
                        {
                            startDate: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        },
                        {
                            dueDate: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        },
                        {
                            $and: [
                                { startDate: { $lte: new Date(startDate) } },
                                { dueDate: { $gte: new Date(endDate) } }
                            ]
                        }
                    ];
                }

                // Get timeline data from tasks
                timelineData = await TasksModels.aggregate([
                    { $match: matchFilter },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'assignedTo',
                            foreignField: '_id',
                            as: 'assignee'
                        }
                    },
                    {
                        $lookup: {
                            from: 'sprints',
                            localField: 'sprintId',
                            foreignField: '_id',
                            as: 'sprint'
                        }
                    },
                    {
                        $unwind: {
                            path: '$assignee',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $unwind: {
                            path: '$sprint',
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $addFields: {
                            duration: this.calculateDurationPipeline(),
                            progress: this.getProgressPipeline()
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            status: 1,
                            priority: 1,
                            startDate: 1,
                            dueDate: 1,
                            duration: 1,
                            progress: 1,
                            assignee: {
                                _id: '$assignee._id',
                                name: '$assignee.name',
                                personalEmail: '$assignee.personalEmail'
                            },
                            sprint: {
                                _id: '$sprint._id',
                                title: '$sprint.title'
                            }
                        }
                    },
                    { $sort: { startDate: 1 } }
                ]);
            }

            // Format for different view types
            let formattedData = timelineData;
            
            if (view === 'calendar') {
                formattedData = timelineData.map(task => ({
                    id: task._id,
                    title: task.title,
                    start: task.startDate,
                    end: task.dueDate,
                    color: this.getStatusColor(task.status),
                    assignee: task.assignee?.name || 'Unassigned',
                    progress: task.progress,
                    milestone: task.milestone || false
                }));
            } else if (view === 'gantt') {
                formattedData = {
                    tasks: timelineData.map(task => ({
                        id: task._id,
                        text: task.title,
                        start_date: task.startDate,
                        end_date: task.dueDate,
                        duration: task.duration,
                        progress: task.progress / 100,
                        priority: task.priority,
                        assignee: task.assignee?.name || 'Unassigned',
                        type: task.milestone ? 'milestone' : 'task'
                    })),
                    links: await this.getTaskDependencies(timelineData.map(t => t._id))
                };
            }

            res.status(200).json({
                message: 'Lấy timeline task thành công',
                view,
                timeline: formattedData,
                summary: {
                    totalTasks: timelineData.length,
                    completedTasks: timelineData.filter(t => t.status === 'COMPLETED').length,
                    inProgressTasks: timelineData.filter(t => t.status === 'IN_PROGRESS').length,
                    pendingTasks: timelineData.filter(t => t.status === 'PENDING').length,
                    averageDuration: timelineData.length > 0 
                        ? (timelineData.reduce((sum, t) => sum + (t.duration || 0), 0) / timelineData.length).toFixed(1)
                        : 0
                }
            });
        } catch (error) {
            console.error('❌ Get task timeline error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // AD-QLTT04: Phân tích timeline
    analyzeTimeline: async (req, res) => {
        try {
            const { timelineId, projectId, sprintId, startDate, endDate } = req.query;

            let analysisData;

            if (timelineId && mongoose.Types.ObjectId.isValid(timelineId)) {
                // Analyze specific timeline
                const timeline = await TimelineModels.findById(timelineId);
                if (!timeline) {
                    return res.status(404).json({ message: 'Timeline không tồn tại.' });
                }

                const taskIds = timeline.tasks.map(t => t.taskId);
                analysisData = await TasksModels.find({ _id: { $in: taskIds } });

            } else {
                // Analyze tasks based on filters
                const matchFilter = {};
                
                if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
                    const sprints = await SprintsModels.find({ courseId: mongoose.Types.ObjectId(projectId) });
                    const sprintIds = sprints.map(s => s._id);
                    matchFilter.sprintId = { $in: sprintIds };
                } else if (sprintId && mongoose.Types.ObjectId.isValid(sprintId)) {
                    matchFilter.sprintId = mongoose.Types.ObjectId(sprintId);
                }

                if (startDate && endDate) {
                    matchFilter.createdAt = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    };
                }

                analysisData = await TasksModels.find(matchFilter);
            }

            // Perform analysis
            const analysis = this.performTimelineAnalysis(analysisData);

            res.status(200).json({
                message: 'Phân tích timeline thành công',
                analysis: {
                    overview: analysis.overview,
                    performance: analysis.performance,
                    distribution: analysis.distribution,
                    recommendations: analysis.recommendations
                }
            });
        } catch (error) {
            console.error('❌ Analyze timeline error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Get all timelines
    getAllTimelines: async (req, res) => {
        try {
            const { page = 1, limit = 10, type, projectId, sprintId } = req.query;

            const filter = {};
            if (type) filter.type = type;
            if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
                filter.projectId = mongoose.Types.ObjectId(projectId);
            }
            if (sprintId && mongoose.Types.ObjectId.isValid(sprintId)) {
                filter.sprintId = mongoose.Types.ObjectId(sprintId);
            }

            const timelines = await TimelineModels.find(filter)
                .populate('projectId', 'title')
                .populate('sprintId', 'title')
                .populate('createdBy', 'name personalEmail')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const total = await TimelineModels.countDocuments(filter);

            res.status(200).json({
                message: 'Lấy danh sách timeline thành công',
                timelines,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('❌ Get all timelines error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Delete timeline
    deleteTimeline: async (req, res) => {
        try {
            const { timelineId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(timelineId)) {
                return res.status(400).json({ message: 'ID timeline không hợp lệ.' });
            }

            const timeline = await TimelineModels.findById(timelineId);
            if (!timeline) {
                return res.status(404).json({ message: 'Timeline không tồn tại.' });
            }

            await TimelineModels.findByIdAndDelete(timelineId);

            res.status(200).json({
                message: 'Timeline đã được xóa thành công',
                deletedTimeline: {
                    id: timeline._id,
                    title: timeline.title
                }
            });
        } catch (error) {
            console.error('❌ Delete timeline error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Helper methods
    calculateDuration(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    },

    calculateDurationPipeline() {
        return {
            $divide: [
                { $subtract: ['$dueDate', '$startDate'] },
                1000 * 60 * 60 * 24
            ]
        };
    },

    getProgressByStatus(status) {
        const progressMap = {
            'PENDING': 0,
            'IN_PROGRESS': 50,
            'REVIEW': 80,
            'COMPLETED': 100,
            'CANCELLED': 0
        };
        return progressMap[status] || 0;
    },

    getProgressPipeline() {
        return {
            $switch: {
                branches: [
                    { case: { $eq: ['$status', 'COMPLETED'] }, then: 100 },
                    { case: { $eq: ['$status', 'IN_PROGRESS'] }, then: 50 },
                    { case: { $eq: ['$status', 'REVIEW'] }, then: 80 },
                    { case: { $eq: ['$status', 'PENDING'] }, then: 0 }
                ],
                default: 0
            }
        };
    },

    getStatusColor(status) {
        const colors = {
            'PENDING': '#ffc107',
            'IN_PROGRESS': '#007bff',
            'REVIEW': '#fd7e14',
            'COMPLETED': '#28a745',
            'CANCELLED': '#dc3545'
        };
        return colors[status] || '#6c757d';
    },

    async getTaskDependencies(taskIds) {
        // You can implement this based on your task dependency model
        // For now, return empty array
        return [];
    },

    performTimelineAnalysis(tasks) {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
        const overdueTasks = tasks.filter(t => 
            t.status !== 'COMPLETED' && new Date(t.dueDate) < new Date()
        ).length;

        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(2) : 0;
        const onTimeRate = totalTasks > 0 ? ((totalTasks - overdueTasks) / totalTasks * 100).toFixed(2) : 0;

        const statusDistribution = tasks.reduce((acc, task) => {
            acc[task.status] = (acc[task.status] || 0) + 1;
            return acc;
        }, {});

        const priorityDistribution = tasks.reduce((acc, task) => {
            acc[task.priority || 'MEDIUM'] = (acc[task.priority || 'MEDIUM'] || 0) + 1;
            return acc;
        }, {});

        const recommendations = this.generateTimelineRecommendations({
            totalTasks,
            completedTasks,
            overdueTasks
        }, 0, completionRate);

        return {
            overview: {
                totalTasks,
                completedTasks,
                overdueTasks,
                completionRate: `${completionRate}%`,
                onTimeRate: `${onTimeRate}%`
            },
            performance: {
                schedulePerformance: overdueTasks > totalTasks * 0.2 ? 'Behind Schedule' : 'On Schedule',
                riskLevel: overdueTasks > totalTasks * 0.3 ? 'High' : overdueTasks > totalTasks * 0.1 ? 'Medium' : 'Low'
            },
            distribution: {
                byStatus: statusDistribution,
                byPriority: priorityDistribution
            },
            recommendations
        };
    },

    generateTimelineRecommendations(data, scheduleVariance, completionRate) {
        const recommendations = [];

        if (parseFloat(completionRate) < 70) {
            recommendations.push('Tỷ lệ hoàn thành thấp. Cần xem xét lại phân bổ nguồn lực và ưu tiên task.');
        }

        if (data.overdueTasks > data.totalTasks * 0.2) {
            recommendations.push('Quá nhiều task bị trễ hạn. Cần điều chỉnh lại timeline và deadline.');
        }

        if (data.totalTasks === 0) {
            recommendations.push('Chưa có task nào trong timeline. Hãy thêm task để bắt đầu theo dõi tiến độ.');
        }

        if (recommendations.length === 0) {
            recommendations.push('Timeline đang được thực hiện tốt. Tiếp tục duy trì hiệu suất này.');
        }

        return recommendations;
    }
};

export default timelineController;