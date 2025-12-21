import AccountsModels from "../models/Accounts.Models.js";
import userModel from "../models/Users.Models.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

// ========== AUTHENTICATION MIDDLEWARES ==========

// Basic token authentication (checks if token is valid)
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc không có token.' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Không có token. Truy cập bị từ chối.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await AccountsModels.findById(decoded.accountId);

        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        // Attach account to request (but don't check verification here)
        req.account = account;
        req.user = decoded; // Keep for backward compatibility
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token không hợp lệ.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn.' });
        } else {
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    }
};

// Authentication + Verification check (for most protected routes)
export const authVerify = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token không hợp lệ hoặc không có token.' });
        }

        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Không có token. Truy cập bị từ chối.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const account = await AccountsModels.findById(decoded.accountId);
        if (!account) {
            return res.status(404).json({ message: 'Không tìm thấy tài khoản.' });
        }

        if (!account.isVerified) {
            return res.status(403).json({ 
                message: 'Tài khoản chưa được xác thực email. Vui lòng kiểm tra email để xác thực.',
                needsVerification: true 
            });
        }
        req.account = account;

        // Lấy user profile
        const user = await userModel.findOne({ accountId: account._id });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
        }

        // 
        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token không hợp lệ.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token đã hết hạn.' });
        } else {
            return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
        }
    }
};


export const registerValidate = async (req, res, next) => {
    try {
        const { email, password, confirmPassword } = req.body

        if (!email) return res.status(400).json({ message: 'Vui lòng nhập email.' });
        if (!password) return res.status(400).json({ message: 'Vui lòng nhập mật khẩu.' });
        if (!confirmPassword) return res.status(400).json({ message: 'Vui lòng nhập lại mật khẩu.' });
        if (password.length < 8) return res.status(400).json({ message: 'Mật khẩu cần có ít nhất 8 kí tự.' });

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Mật khẩu không khớp.' });
        }

        const emailRegex = /^[\w.+-]+@gmail\.com$/
        const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if (!emailRegex.test(email)) return res.status(400).json({ message: 'Hãy sử dụng đúng format Email của Google' })
        if (!passwordRegex.test(password)) return res.status(400).json({ message: 'Mật khẩu cần có nhiều hơn 8 kí tự kèm với 1 kí tự viết hoa, 1 kí tự viết thường và 1 kí tự đặc biệt' })

        next()  
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' || error.message })
    }
}

export const validateLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu.' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Định dạng email không hợp lệ.' });
        }

        // Find account by email
        const account = await AccountsModels.findOne({ email });
        if (!account) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, account.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }

        // Check if account is verified
        if (!account.isVerified) {
            return res.status(403).json({ 
                message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email.',
                needsVerification: true,
                email: account.email
            });
        }

        // Check if account is active
        if (!account.active) {
            return res.status(403).json({ message: 'Tài khoản đã bị vô hiệu hóa.' });
        }

        // Attach verified account to request
        req.account = account;
        next();

    } catch (error) {
        console.error('Login validation error:', error);
        return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
};

// Check if user has ADMIN role in Account model
export const requireAccountAdmin = async (req, res, next) => {
    try {
        if (!req.account) {
            return res.status(401).json({ message: 'Truy cập bị từ chối. Vui lòng đăng nhập.' });
        }

        if (req.account.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Chỉ ADMIN mới có quyền truy cập chức năng này.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
};

// Check if user has STAFF role in Account model
export const requireAccountStaff = async (req, res, next) => {
    try {
        if (!req.account) {
            return res.status(401).json({ message: 'Truy cập bị từ chối. Vui lòng đăng nhập.' });
        }

        if (!['ADMIN', 'STAFF'].includes(req.account.role)) {
            return res.status(403).json({ message: 'Chỉ STAFF hoặc ADMIN mới có quyền truy cập chức năng này.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
};

// Check if user has LEADER role in User model (requires User profile)
export const requireUserLeader = async (req, res, next) => {
    try {
        if (!req.account) {
            return res.status(401).json({ message: 'Truy cập bị từ chối. Vui lòng đăng nhập.' });
        }

        // Get user profile to check roleTag
        const user = await userModel.findOne({ accountId: req.account._id });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
        }

        if (!['LEADER', 'ADMIN'].includes(user.roleTag)) {
            return res.status(403).json({ message: 'Chỉ LEADER hoặc ADMIN mới có quyền truy cập chức năng này.' });
        }

        req.user = user; // Attach user profile for use in controllers
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
};

// Check if user has ADMIN role in User model (requires User profile)
export const requireUserAdmin = async (req, res, next) => {
    try {
        if (!req.account) {
            return res.status(401).json({ message: 'Truy cập bị từ chối. Vui lòng đăng nhập.' });
        }

        // Get user profile to check roleTag
        const user = await userModel.findOne({ accountId: req.account._id });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
        }

        if (user.roleTag !== 'ADMIN') {
            return res.status(403).json({ message: 'Chỉ ADMIN mới có quyền truy cập chức năng này.' });
        }

        req.user = user; // Attach user profile for use in controllers
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
};

// Kiểm tra nếu user là LEADER hoặc ADMIN (dựa vào user.roleTag)
export const requireLeaderOrAdmin = async (req, res, next) => {
    try {
        if (!req.account) {
            return res.status(401).json({ message: 'Truy cập bị từ chối. Vui lòng đăng nhập.' });
        }

        const user = req.user || await userModel.findOne({ accountId: req.account._id });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng.' });
        }

        if (!['LEADER', 'ADMIN'].includes(user.roleTag)) {
            return res.status(403).json({ message: 'Chỉ LEADER hoặc ADMIN mới được phép thực hiện thao tác này.' });
        }

        req.user = user; // Gán lại để chắc chắn controller dùng được
        next();
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server nội bộ.', error: error.message });
    }
};

// For routes that need authentication but allow unverified accounts
export const authOnly = [authenticateToken];

// For most protected routes (requires authentication + verification)
export const authAndVerified = [authVerify];

// For admin-only routes at account level
export const adminOnly = [authVerify, requireAccountAdmin];

// For staff-only routes at account level  
export const staffOnly = [authVerify, requireAccountStaff];

// For leader-only routes at user level
export const leaderOnly = [authVerify, requireUserLeader];

// For admin-only routes at user level
export const userAdminOnly = [authVerify, requireUserAdmin];

/* 
========== USAGE EXAMPLES ==========

// Allow unverified accounts (like for resending verification email)
router.post('/resend-verification', ...authOnly, controller.resendVerification);

// Normal protected routes
router.get('/profile', ...authAndVerified, controller.getProfile);

// Admin only routes
router.get('/all-accounts', ...adminOnly, controller.getAllAccounts);

// Staff routes  
router.get('/reports', ...staffOnly, controller.getReports);

// Leader routes
router.post('/assign-task', ...leaderOnly, controller.assignTask);

// User admin routes
router.put('/user-roles', ...userAdminOnly, controller.updateUserRoles);

========== MIDDLEWARE FLOW ==========

1. authenticateToken: Only checks if JWT is valid
   - Sets req.account and req.user
   - Doesn't check verification status
   - Use for: resend verification, check profile existence

2. authVerify: Checks JWT + verification status
   - Sets req.account
   - Requires isVerified = true
   - Use for: most protected routes

3. Role middlewares: Check specific roles
   - requireAccountAdmin/Staff: checks account.role (ADMIN/STAFF)
   - requireUserLeader/Admin: checks user.roleTag (LEADER/ADMIN/MEMBER)
   - Use after authVerify for role-specific routes

*/
