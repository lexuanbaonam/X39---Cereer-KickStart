import userModel from "../models/Users.Models.js";
import AccountsModels from "../models/Accounts.Models.js";
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const personalManagementController = {
    // AD-QLTTCN05: Xem thông tin cá nhân (Admin viewing any employee)
    getPersonalInfo: async (req, res) => {
        try {
            const { employeeId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ message: 'ID nhân viên không hợp lệ.' });
            }

            // Get complete personal information
            const personalInfo = await userModel.findById(employeeId)
                .populate({
                    path: 'departs',
                    select: 'name description'
                })
                .populate({
                    path: 'jobPosition',
                    select: 'name description level'
                })
                .populate({
                    path: 'accountId',
                    select: 'email role isVerified active createdAt'
                })
                .select('-__v');

            if (!personalInfo) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin nhân viên.' });
            }

            // Get additional statistics
            const additionalStats = await this.getEmployeeStats(employeeId);

            res.status(200).json({
                message: 'Lấy thông tin cá nhân thành công',
                personalInfo: {
                    basic: {
                        _id: personalInfo._id,
                        name: personalInfo.name,
                        personalEmail: personalInfo.personalEmail,
                        companyEmail: personalInfo.companyEmail,
                        phoneNumber: personalInfo.phoneNumber,
                        dob: personalInfo.dob,
                        active: personalInfo.active
                    },
                    work: {
                        roleTag: personalInfo.roleTag,
                        departments: personalInfo.departs,
                        positions: personalInfo.jobPosition
                    },
                    account: personalInfo.accountId,
                    statistics: additionalStats
                }
            });
        } catch (error) {
            console.error('❌ Get personal info error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // AD-QLTTCN05: Chỉnh sửa thông tin cá nhân (Admin editing any employee)
    editPersonalInfo: async (req, res) => {
        try {
            const { employeeId } = req.params;
            const updateData = req.body;

            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ message: 'ID nhân viên không hợp lệ.' });
            }

            // Find employee
            const employee = await userModel.findById(employeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Nhân viên không tồn tại.' });
            }

            // Define allowed fields for update
            const allowedFields = [
                'name', 'personalEmail', 'companyEmail', 'phoneNumber', 'dob',
                'roleTag', 'departs', 'jobPosition', 'active'
            ];

            // Build update object
            const userUpdateData = {};
            allowedFields.forEach(field => {
                if (updateData[field] !== undefined) {
                    if (field === 'departs' || field === 'jobPosition') {
                        userUpdateData[field] = updateData[field].map(id => mongoose.Types.ObjectId(id));
                    } else if (field === 'dob') {
                        userUpdateData[field] = new Date(updateData[field]);
                    } else {
                        userUpdateData[field] = updateData[field];
                    }
                }
            });

            // Check for email uniqueness if updating
            if (updateData.personalEmail && updateData.personalEmail !== employee.personalEmail) {
                const existingUser = await userModel.findOne({ 
                    personalEmail: updateData.personalEmail,
                    _id: { $ne: employeeId }
                });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email cá nhân đã được sử dụng bởi nhân viên khác.' });
                }
            }

            // Update account information if provided
            const accountUpdateData = {};
            if (updateData.accountEmail) accountUpdateData.email = updateData.accountEmail;
            if (updateData.accountRole) accountUpdateData.role = updateData.accountRole;
            if (updateData.accountActive !== undefined) accountUpdateData.active = updateData.accountActive;

            if (Object.keys(accountUpdateData).length > 0) {
                // Check account email uniqueness
                if (accountUpdateData.email) {
                    const existingAccount = await AccountsModels.findOne({
                        email: accountUpdateData.email,
                        _id: { $ne: employee.accountId }
                    });
                    if (existingAccount) {
                        return res.status(400).json({ message: 'Email tài khoản đã được sử dụng.' });
                    }
                }

                await AccountsModels.findByIdAndUpdate(
                    employee.accountId,
                    accountUpdateData,
                    { runValidators: true }
                );
            }

            // Update user information
            const updatedEmployee = await userModel.findByIdAndUpdate(
                employeeId,
                userUpdateData,
                { new: true, runValidators: true }
            ).populate(['departs', 'jobPosition', 'accountId']);

            res.status(200).json({
                message: 'Thông tin cá nhân đã được cập nhật thành công',
                updatedInfo: updatedEmployee,
                changes: {
                    userFields: Object.keys(userUpdateData),
                    accountFields: Object.keys(accountUpdateData)
                }
            });
        } catch (error) {
            console.error('❌ Edit personal info error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // AD-QLTTCN05: Đổi mật khẩu (Admin changing any employee's password)
    changePassword: async (req, res) => {
        try {
            const { employeeId } = req.params;
            const { newPassword, confirmPassword, sendNotification = true } = req.body;

            if (!mongoose.Types.ObjectId.isValid(employeeId)) {
                return res.status(400).json({ message: 'ID nhân viên không hợp lệ.' });
            }

            // Validate password
            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
            }

            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'Mật khẩu xác nhận không khớp.' });
            }

            // Find employee and account
            const employee = await userModel.findById(employeeId);
            if (!employee) {
                return res.status(404).json({ message: 'Nhân viên không tồn tại.' });
            }

            const account = await AccountsModels.findById(employee.accountId);
            if (!account) {
                return res.status(404).json({ message: 'Tài khoản không tồn tại.' });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            account.password = hashedPassword;
            await account.save();

            // Log password change
            console.log(`🔒 Admin ${req.account.email} changed password for employee ${employee.personalEmail}`);

            // Send notification email if requested (you can implement this)
            if (sendNotification) {
                // await sendPasswordChangeNotification(account.email, employee.name);
            }

            res.status(200).json({
                message: 'Mật khẩu đã được thay đổi thành công',
                employee: {
                    id: employee._id,
                    name: employee.name,
                    email: account.email
                },
                changedBy: {
                    adminId: req.account._id,
                    adminEmail: req.account.email
                },
                timestamp: new Date()
            });
        } catch (error) {
            console.error('❌ Change password error:', error);
            res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Get employee statistics
    async getEmployeeStats(employeeId) {
        try {
            // This would depend on your Task model structure
            const stats = {
                totalTasks: 0,
                completedTasks: 0,
                pendingTasks: 0,
                overdueTasks: 0,
                joinDate: null,
                lastActive: null
            };

            // Get user join date
            const user = await userModel.findById(employeeId);
            if (user) {
                stats.joinDate = user.createdAt;
            }

            return stats;
        } catch (error) {
            console.error('❌ Get employee stats error:', error);
            return {
                totalTasks: 0,
                completedTasks: 0,
                pendingTasks: 0,
                overdueTasks: 0,
                joinDate: null,
                lastActive: null
            };
        }
    }
};

export default personalManagementController;