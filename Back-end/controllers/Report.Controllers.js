import userModel from "../models/Users.Models.js";
import TasksModels from "../models/Tasks.Models.js";
import SprintsModels from "../models/Sprints.Models.js";
import CoursesModels from "../models/Courses.Models.js";
import mongoose from 'mongoose';

const reportsController = {
    // AD-QLTT03: Xem báo cáo tổng quan
    getOverviewReport: async (req, res) => {
        try {
            const { startDate, endDate, departmentId } = req.query;

            // Build date filter
            const dateFilter = {};
            if (startDate && endDate) {
                dateFilter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            // Build department filter
            const deptFilter = {};
            if (departmentId && mongoose.Types.ObjectId.isValid(departmentId)) {
                deptFilter.departs = mongoose.Types.ObjectId(departmentId);
            }

            // Get overview statistics
            const [
                totalEmployees,
                activeEmployees,
                totalTasks,
                completedTasks,
                inProgressTasks,
                totalProjects,
                activeProjects,
                totalSprints,
                activeSprints
            ] = await Promise.all([
                // Employee statistics
                userModel.countDocuments({ ...deptFilter }),
                userModel.countDocuments({ ...deptFilter, active: true }),
                
                // Task statistics
                TasksModels.countDocuments(dateFilter),
                TasksModels.countDocuments({ ...dateFilter, status: 'COMPLETED' }),
                TasksModels.countDocuments({ ...dateFilter, status: 'IN_PROGRESS' }),
                
                // Project statistics
                CoursesModels.countDocuments(dateFilter),
                CoursesModels.countDocuments({ ...dateFilter, status: 'ACTIVE' }),
                
                // Sprint statistics
                SprintsModels.countDocuments(dateFilter),
                SprintsModels.countDocuments({ ...dateFilter, status: 'ACTIVE' })
            ]);

            // Calculate completion rates
            const taskCompletionRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
            const employeeUtilization = totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(2) : 0;

            // Get task distribution by status
            const taskStatusDistribution = await TasksModels.aggregate([
                { $match: dateFilter },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        status: '$_id',
                        count: 1,
                        _id: 0
                    }
                }
            ]);

            // Get project progress summary
            const projectProgress = await CoursesModels.aggregate([
                { $match: dateFilter },
                {
                    $lookup: {
                        from: 'sprints',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'sprints'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        status: 1,
                        totalSprints: { $size: '$sprints' },
                        completedSprints: {
                            $size: {
                                $filter: {
                                    input: '$sprints',
                                    cond: { $eq: ['$$this.status', 'COMPLETED'] }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        progressPercentage: {
                            $cond: [
                                { $gt: ['$totalSprints', 0] },
                                { $multiply: [{ $divide: ['$completedSprints', '$totalSprints'] }, 100] },
                                0
                            ]
                        }
                    }
                }
            ]);

            res.status(200).json({
                message: 'Lấy báo cáo tổng quan thành công',
                overview: {
                    employees: {
                        total: totalEmployees,
                        active: activeEmployees,
                        utilizationRate: `${employeeUtilization}%`
                    },
                    tasks: {
                        total: totalTasks,
                        completed: completedTasks,
                        inProgress: inProgressTasks,
                        completionRate: `${taskCompletionRate}%`,
                        statusDistribution: taskStatusDistribution
                    },
                    projects: {
                        total: totalProjects,
                        active: activeProjects,
                        progress: projectProgress
                    },
                    sprints: {
                        total: totalSprints,
                        active: activeSprints
                    }
                },
                filters: {
                    startDate,
                    endDate,
                    departmentId
                }
            });
        } catch (error) {
            console.error('❌ Get overview report error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // AD-QLTT03: Xem báo cáo chi tiết
    getDetailedReport: async (req, res) => {
        try {
            const { type, id, startDate, endDate } = req.query;

            if (!type || !['project', 'sprint', 'employee', 'task'].includes(type)) {
                return res.status(400).json({ message: 'Loại báo cáo không hợp lệ. Sử dụng: project, sprint, employee, task' });
            }

            let report = {};

            switch (type) {
                case 'project':
                    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                        return res.status(400).json({ message: 'ID dự án không hợp lệ.' });
                    }
                    report = await this.getProjectDetailReport(id, startDate, endDate);
                    break;

                case 'employee':
                    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                        return res.status(400).json({ message: 'ID nhân viên không hợp lệ.' });
                    }
                    report = await this.getEmployeeDetailReport(id, startDate, endDate);
                    break;

                case 'sprint':
                    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                        return res.status(400).json({ message: 'ID sprint không hợp lệ.' });
                    }
                    report = await this.getSprintDetailReport(id, startDate, endDate);
                    break;

                case 'task':
                    report = await this.getTaskDetailReport(startDate, endDate);
                    break;
            }

            res.status(200).json({
                message: `Lấy báo cáo chi tiết ${type} thành công`,
                reportType: type,
                report
            });
        } catch (error) {
            console.error('❌ Get detailed report error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // AD-QLTT03: Phân tích hiệu suất công việc
    analyzeWorkPerformance: async (req, res) => {
        try {
            const { employeeId, departmentId, startDate, endDate } = req.query;

            // Build filters
            const userFilter = {};
            const taskFilter = {};

            if (employeeId && mongoose.Types.ObjectId.isValid(employeeId)) {
                userFilter._id = mongoose.Types.ObjectId(employeeId);
                taskFilter.assignedTo = mongoose.Types.ObjectId(employeeId);
            }

            if (departmentId && mongoose.Types.ObjectId.isValid(departmentId)) {
                userFilter.departs = mongoose.Types.ObjectId(departmentId);
            }

            if (startDate && endDate) {
                taskFilter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            // Get employee performance data
            const performanceData = await userModel.aggregate([
                { $match: userFilter },
                {
                    $lookup: {
                        from: 'tasks',
                        let: { userId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$assignedTo', '$$userId'] },
                                    ...taskFilter
                                }
                            }
                        ],
                        as: 'tasks'
                    }
                },
                {
                    $addFields: {
                        totalTasks: { $size: '$tasks' },
                        completedTasks: {
                            $size: {
                                $filter: {
                                    input: '$tasks',
                                    cond: { $eq: ['$$this.status', 'COMPLETED'] }
                                }
                            }
                        },
                        onTimeTasks: {
                            $size: {
                                $filter: {
                                    input: '$tasks',
                                    cond: {
                                        $and: [
                                            { $eq: ['$$this.status', 'COMPLETED'] },
                                            { $lte: ['$$this.completedAt', '$$this.dueDate'] }
                                        ]
                                    }
                                }
                            }
                        },
                        overdueTasks: {
                            $size: {
                                $filter: {
                                    input: '$tasks',
                                    cond: {
                                        $and: [
                                            { $ne: ['$$this.status', 'COMPLETED'] },
                                            { $lt: ['$$this.dueDate', new Date()] }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        completionRate: {
                            $cond: [
                                { $gt: ['$totalTasks', 0] },
                                { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] },
                                0
                            ]
                        },
                        onTimeRate: {
                            $cond: [
                                { $gt: ['$completedTasks', 0] },
                                { $multiply: [{ $divide: ['$onTimeTasks', '$completedTasks'] }, 100] },
                                0
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        personalEmail: 1,
                        roleTag: 1,
                        totalTasks: 1,
                        completedTasks: 1,
                        onTimeTasks: 1,
                        overdueTasks: 1,
                        completionRate: { $round: ['$completionRate', 2] },
                        onTimeRate: { $round: ['$onTimeRate', 2] },
                        performanceScore: {
                            $round: [
                                {
                                    $multiply: [
                                        { $add: ['$completionRate', '$onTimeRate'] },
                                        0.5
                                    ]
                                },
                                2
                            ]
                        }
                    }
                },
                { $sort: { performanceScore: -1 } }
            ]);

            res.status(200).json({
                message: 'Phân tích hiệu suất công việc thành công',
                performance: performanceData,
                summary: {
                    totalEmployees: performanceData.length,
                    averageCompletionRate: performanceData.length > 0 
                        ? (performanceData.reduce((sum, emp) => sum + emp.completionRate, 0) / performanceData.length).toFixed(2)
                        : 0,
                    averageOnTimeRate: performanceData.length > 0 
                        ? (performanceData.reduce((sum, emp) => sum + emp.onTimeRate, 0) / performanceData.length).toFixed(2)
                        : 0
                }
            });
        } catch (error) {
            console.error('❌ Analyze work performance error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // AD-QLTT03: Phân tích tiến độ dự án
    analyzeProjectProgress: async (req, res) => {
        try {
            const { projectId, startDate, endDate } = req.query;

            // Build filters
            const projectFilter = {};
            if (projectId && mongoose.Types.ObjectId.isValid(projectId)) {
                projectFilter._id = mongoose.Types.ObjectId(projectId);
            }

            if (startDate && endDate) {
                projectFilter.createdAt = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            // Get project progress analysis
            const projectAnalysis = await CoursesModels.aggregate([
                { $match: projectFilter },
                {
                    $lookup: {
                        from: 'sprints',
                        localField: '_id',
                        foreignField: 'courseId',
                        as: 'sprints'
                    }
                },
                {
                    $lookup: {
                        from: 'tasks',
                        let: { projectId: '$_id' },
                        pipeline: [
                            {
                                $lookup: {
                                    from: 'sprints',
                                    localField: 'sprintId',
                                    foreignField: '_id',
                                    as: 'sprint'
                                }
                            },
                            { $unwind: '$sprint' },
                            {
                                $match: {
                                    $expr: { $eq: ['$sprint.courseId', '$$projectId'] }
                                }
                            }
                        ],
                        as: 'allTasks'
                    }
                },
                {
                    $addFields: {
                        totalSprints: { $size: '$sprints' },
                        completedSprints: {
                            $size: {
                                $filter: {
                                    input: '$sprints',
                                    cond: { $eq: ['$$this.status', 'COMPLETED'] }
                                }
                            }
                        },
                        activeSprints: {
                            $size: {
                                $filter: {
                                    input: '$sprints',
                                    cond: { $eq: ['$$this.status', 'ACTIVE'] }
                                }
                            }
                        },
                        totalTasks: { $size: '$allTasks' },
                        completedTasks: {
                            $size: {
                                $filter: {
                                    input: '$allTasks',
                                    cond: { $eq: ['$$this.status', 'COMPLETED'] }
                                }
                            }
                        },
                        overdueTasks: {
                            $size: {
                                $filter: {
                                    input: '$allTasks',
                                    cond: {
                                        $and: [
                                            { $ne: ['$$this.status', 'COMPLETED'] },
                                            { $lt: ['$$this.dueDate', new Date()] }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        sprintProgress: {
                            $cond: [
                                { $gt: ['$totalSprints', 0] },
                                { $multiply: [{ $divide: ['$completedSprints', '$totalSprints'] }, 100] },
                                0
                            ]
                        },
                        taskProgress: {
                            $cond: [
                                { $gt: ['$totalTasks', 0] },
                                { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] },
                                0
                            ]
                        },
                        healthScore: {
                            $cond: [
                                { $gt: ['$totalTasks', 0] },
                                {
                                    $subtract: [
                                        100,
                                        { $multiply: [{ $divide: ['$overdueTasks', '$totalTasks'] }, 100] }
                                    ]
                                },
                                100
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        description: 1,
                        status: 1,
                        startDate: 1,
                        endDate: 1,
                        totalSprints: 1,
                        completedSprints: 1,
                        activeSprints: 1,
                        totalTasks: 1,
                        completedTasks: 1,
                        overdueTasks: 1,
                        sprintProgress: { $round: ['$sprintProgress', 2] },
                        taskProgress: { $round: ['$taskProgress', 2] },
                        healthScore: { $round: ['$healthScore', 2] },
                        overallProgress: {
                            $round: [
                                {
                                    $multiply: [
                                        { $add: ['$sprintProgress', '$taskProgress'] },
                                        0.5
                                    ]
                                },
                                2
                            ]
                        }
                    }
                }
            ]);

            res.status(200).json({
                message: 'Phân tích tiến độ dự án thành công',
                projects: projectAnalysis,
                summary: {
                    totalProjects: projectAnalysis.length,
                    averageProgress: projectAnalysis.length > 0 
                        ? (projectAnalysis.reduce((sum, proj) => sum + proj.overallProgress, 0) / projectAnalysis.length).toFixed(2)
                        : 0,
                    healthyProjects: projectAnalysis.filter(proj => proj.healthScore >= 80).length,
                    atRiskProjects: projectAnalysis.filter(proj => proj.healthScore < 60).length
                }
            });
        } catch (error) {
            console.error('❌ Analyze project progress error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Helper methods for detailed reports
    async getProjectDetailReport(projectId, startDate, endDate) {
        // Implementation for project detail report
        const project = await CoursesModels.findById(projectId)
            .populate('sprints')
            .populate({
                path: 'sprints',
                populate: {
                    path: 'tasks'
                }
            });
        
        return {
            project,
            // Add more detailed analysis
        };
    },

    async getEmployeeDetailReport(employeeId, startDate, endDate) {
        // Implementation for employee detail report
        const employee = await userModel.findById(employeeId)
            .populate('departs')
            .populate('jobPosition');
        
        return {
            employee,
            // Add more detailed analysis
        };
    },

    async getSprintDetailReport(sprintId, startDate, endDate) {
        // Implementation for sprint detail report
        const sprint = await SprintsModels.findById(sprintId)
            .populate('tasks')
            .populate('courseId');
        
        return {
            sprint,
            // Add more detailed analysis
        };
    },

    async getTaskDetailReport(startDate, endDate) {
        // Implementation for task detail report
        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const tasks = await TasksModels.find(dateFilter)
            .populate('assignedTo')
            .populate('sprintId');
        
        return {
            tasks,
            // Add more detailed analysis
        };
    }
};

export default reportsController;