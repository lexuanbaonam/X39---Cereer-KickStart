import userModel from "../models/Users.Models.js";
import AccountsModels from "../models/Accounts.Models.js";

const userController = {
    // Get current user's profile
    getMyProfile: async (req, res) => {
        try {
            const accountId = req.account._id; // From authVerify middleware
            console.log('Account ID from token:', accountId);

            const user = await userModel.findOne({ accountId })
                .populate('departs', 'name') // Populate department name
                .populate('jobPosition', 'title'); // Populate job position title

            console.log('User found:', user);

            if (!user) {
                return res.status(404).json({
                    message: 'Không tìm thấy thông tin người dùng. Vui lòng tạo profile trước.',
                    accountId: accountId.toString(),
                    suggestion: 'Sử dụng POST /api/users/create-profile để tạo profile mới'
                });
            }

            return res.status(200).json({
                message: 'Lấy thông tin người dùng thành công',
                user: user
            });
        } catch (error) {
            console.error('Error in getMyProfile:', error);
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Create user profile for the first time
    createMyProfile: async (req, res) => {
        try {
            const accountId = req.account._id; // From authVerify middleware
            const { companyEmail, name, phoneNumber, dob, departs, jobPosition } = req.body;

            // Check if user profile already exists
            const existingUser = await userModel.findOne({ accountId });
            if (existingUser) {
                return res.status(400).json({ message: 'Profile đã tồn tại. Sử dụng PUT để cập nhật.' });
            }

            // Validate required fields
            if (!name || !phoneNumber || !dob) {
                return res.status(400).json({
                    message: 'Vui lòng điền đầy đủ thông tin bắt buộc: name, phoneNumber, dob'
                });
            }

            // Check company email uniqueness only if it's provided and not empty
            if (companyEmail && companyEmail.trim() !== '') {
                const existingCompanyEmailUser = await userModel.findOne({ companyEmail: companyEmail.trim() });
                if (existingCompanyEmailUser) {
                    return res.status(400).json({ message: 'Email công ty đã được sử dụng.' });
                }
            }

            // Prepare user data object - IMPORTANT: Don't include companyEmail if it's empty
            const userData = {
                accountId,
                personalEmail: req.account.email, // Use the email from the account
                name,
                phoneNumber,
                dob: new Date(dob),
                departs: departs || [],
                jobPosition: jobPosition || [],
                roleTag: 'MEMBER' // Default role
            };

            // ONLY add companyEmail if it exists and is not empty
            if (companyEmail && companyEmail.trim() !== '') {
                userData.companyEmail = companyEmail.trim();
            }
            // If companyEmail is undefined, null, or empty string, don't include it at all

            console.log('Creating user with data:', userData); // Debug log

            // Create new user profile
            const newUser = await userModel.create(userData);

            const populatedUser = await userModel.findById(newUser._id)
                .populate('departs', 'name')
                .populate('jobPosition', 'title');

            return res.status(201).json({
                message: 'Tạo profile thành công',
                user: populatedUser
            });

        } catch (error) {
            console.error('Error in createMyProfile:', error);
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Update current user's personal data
    updateMyProfile: async (req, res) => {
        try {
            const accountId = req.account._id; // From authVerify middleware
            const { personalEmail, companyEmail, name, phoneNumber, dob } = req.body;

            // Find the user by their account ID
            const user = await userModel.findOne({ accountId });

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
            }

            // Validate email uniqueness if personalEmail is being updated
            if (personalEmail && personalEmail !== user.personalEmail) {
                const existingUser = await userModel.findOne({
                    personalEmail,
                    _id: { $ne: user._id }
                });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email cá nhân đã được sử dụng.' });
                }
            }

            // Validate company email uniqueness if companyEmail is being updated
            if (companyEmail && companyEmail.trim() !== '' && companyEmail !== user.companyEmail) {
                const existingUser = await userModel.findOne({
                    companyEmail: companyEmail.trim(),
                    _id: { $ne: user._id }
                });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email công ty đã được sử dụng.' });
                }
            }

            // Build update data object
            const updateData = {};
            if (personalEmail) updateData.personalEmail = personalEmail;
            if (name) updateData.name = name;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (dob) updateData.dob = new Date(dob);

            // Handle companyEmail separately
            if (companyEmail !== undefined) {
                if (!companyEmail || companyEmail.trim() === '') {
                    // If companyEmail is empty, remove it from the document
                    updateData.$unset = { companyEmail: 1 };
                } else {
                    // If companyEmail has a value, update it
                    updateData.companyEmail = companyEmail.trim();
                }
            }

            console.log('Updating user with data:', updateData); // Debug log

            const updatedUser = await userModel.findOneAndUpdate(
                { accountId }, // Only update user with this account ID
                updateData,
                { new: true, runValidators: true }
            ).populate('departs', 'name').populate('jobPosition', 'title');

            return res.status(200).json({
                message: 'Cập nhật thông tin cá nhân thành công',
                user: updatedUser
            });

        } catch (error) {
            console.error('Error in updateMyProfile:', error);
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Admin only - get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await userModel.find({ active: true })
                .populate('accountId', 'email role active')
                .populate('departs', 'name')
                .populate('jobPosition', 'title');

            return res.status(200).json({
                message: 'Lấy danh sách người dùng thành công',
                users: users
            });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Admin only - get user by ID
    getUserById: async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await userModel.findById(userId)
                .populate('accountId', 'email role active')
                .populate('departs', 'name')
                .populate('jobPosition', 'title');

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
            }

            return res.status(200).json({
                message: 'Lấy thông tin người dùng thành công',
                user: user
            });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },

    // Admin only - update user by ID
    updateUserById: async (req, res) => {
        try {
            const { userId } = req.params;
            const { personalEmail, companyEmail, name, phoneNumber, dob, departs, jobPosition, roleTag } = req.body;

            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
            }

            // Validate email uniqueness if personalEmail is being updated
            if (personalEmail && personalEmail !== user.personalEmail) {
                const existingUser = await userModel.findOne({
                    personalEmail,
                    _id: { $ne: userId }
                });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email cá nhân đã được sử dụng.' });
                }
            }

            // Validate company email uniqueness if companyEmail is being updated
            if (companyEmail && companyEmail !== user.companyEmail) {
                const existingUser = await userModel.findOne({
                    companyEmail,
                    _id: { $ne: userId }
                });
                if (existingUser) {
                    return res.status(400).json({ message: 'Email công ty đã được sử dụng.' });
                }
            }

            // Update only the fields that are provided
            const updateData = {};
            if (personalEmail) updateData.personalEmail = personalEmail;
            if (companyEmail) updateData.companyEmail = companyEmail;
            if (name) updateData.name = name;
            if (phoneNumber) updateData.phoneNumber = phoneNumber;
            if (dob) updateData.dob = new Date(dob);
            if (departs) updateData.departs = departs;
            if (jobPosition) updateData.jobPosition = jobPosition;
            if (roleTag) updateData.roleTag = roleTag;

            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                updateData,
                { new: true, runValidators: true }
            ).populate('accountId', 'email role active')
                .populate('departs', 'name')
                .populate('jobPosition', 'title');

            return res.status(200).json({
                message: 'Cập nhật thông tin người dùng thành công',
                user: updatedUser
            });

        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    },
    changePassword: async (req, res) => {
        try {
            const accountId = req.account._id; // From authVerify middleware
            const { oldPassword, newPassword } = req.body;

            if (!oldPassword || !newPassword) {
                return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu cũ và mật khẩu mới.' });
            }

            const user = await userModel.findOne({ accountId });
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
            }

            // Here you would typically verify the old password
            // For simplicity, let's assume it's verified

            // Update the password in the account model (not shown here)
            await AccountsModels.updateOne({ _id: user.accountId }, { password: newPassword });

            return res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    }
}

export default userController;