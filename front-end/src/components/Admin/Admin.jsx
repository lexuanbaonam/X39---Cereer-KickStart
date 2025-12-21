import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Button,
  CircularProgress,
  Collapse,
} from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BusinessIcon from "@mui/icons-material/Business"; // Reverted to Material-UI import
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { toast } from "react-toastify"; // Import toastify

import "./Admin.css";

// --- FunctionList Component ---
const FunctionList = ({ onSelectFunction }) => {
  const [open, setOpen] = useState(false);
  const [openDept, setOpenDept] = useState(false);

  const toggleOpen = () => setOpen(!open);
  const toggleOpenDept = () => setOpenDept(!openDept);

  const subFunctions = [
    { key: 'personalInfo', title: 'Quản lý thông tin cá nhân', desc: 'Chỉnh sửa thông tin cá nhân' },
    { key: 'jobInfo', title: 'Quản lý thông tin công việc', desc: 'Quản lý thông tin công việc' },
    { key: 'workSchedule', title: 'Quản lý lịch làm việc', desc: 'Quản lý lịch làm việc' },
    { key: 'accountInfo', title: 'Quản lý tài khoản', desc: 'Quản lý tài khoản nhân viên' },
  ];

  return (
    <Box className="function-list-box">
      <List>
        <ListItem
          button
          onClick={toggleOpen}
          className={`sub-function-item ${open ? "active" : ""}`}
          sx={{ mb: 1 }}
        >
          <ListItemIcon>
            <PeopleOutlineIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography className="func-title">Danh sách nhân viên</Typography>}
            secondary={<Typography className="func-desc">Hiển thị danh sách tất cả nhân viên trong hệ thống</Typography>}
          />
          {open
            ? <KeyboardArrowDownIcon color="primary" />
            : <KeyboardArrowRightIcon color="primary" />}
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="MuiCollapse-root">
            <ListItem
              button
              className="sub-function-item"
              onClick={() => onSelectFunction(null)}
            >
              <Box className="item-content" sx={{ width: '100%' }}>
                <Typography className="func-title">Xem danh sách</Typography>
                <Typography className="func-desc">Xem và quản lý danh sách nhân viên</Typography>
              </Box>
            </ListItem>
            {subFunctions.map((sf) => (
              <ListItem
                button
                key={sf.key}
                className="sub-function-item"
                onClick={() => onSelectFunction(sf.key)}
              >
                <Box className="item-content" sx={{ width: '100%' }}>
                  <Typography className="func-title">{sf.title}</Typography>
                  <Typography className="func-desc">{sf.desc}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Collapse>
        <ListItem
          button
          onClick={toggleOpenDept}
          className={`sub-function-item ${openDept ? "active" : ""}`}
          sx={{ mb: 1, mt: 2 }}
        >
          <ListItemIcon>
            <BusinessIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography className="func-title">Phòng ban</Typography>}
            secondary={<Typography className="func-desc">Tạo và quản lý phòng ban</Typography>}
          />
          {openDept
            ? <KeyboardArrowDownIcon color="primary" />
            : <KeyboardArrowRightIcon color="primary" />}
        </ListItem>
        <Collapse in={openDept} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className="MuiCollapse-root">
            <ListItem
              button
              className="sub-function-item"
              onClick={() => onSelectFunction('addDepartment')}
            >
              <Box className="item-content" sx={{ width: '100%' }}>
                <Typography className="func-title">Tạo phòng ban</Typography>
                <Typography className="func-desc">Thêm mới phòng ban vào hệ thống</Typography>
              </Box>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

// --- Admin Component ---
const Admin = ({ authToken }) => {
  const [activeForm, setActiveForm] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [rolesInput, setRolesInput] = useState("");

  const [departmentName, setDepartmentName] = useState("");
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentDesc, setDepartmentDesc] = useState("");


  const [newEmployeeEmail, setNewEmployeeEmail] = useState('');
  const [newEmployeePassword, setNewEmployeePassword] = useState('');
  const [newEmployeeConfirmPassword, setNewEmployeeConfirmPassword] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeAge, setNewEmployeeAge] = useState('');
  const [newEmployeePhone, setNewEmployeePhone] = useState('');



  const fetchEmployees = async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await fetch("https://back-end-hk2p.onrender.com/api/users/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || `Server returned ${res.status}`);
      }
      const data = await res.json();
      setEmployees(data.users || []);
    } catch (err) {
      console.error(err);
      toast.error(`Không thể tải danh sách nhân viên: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchEmployees();
  }, [authToken]);

  const handleSelectFunction = (key) => {
    setActiveForm(key);

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 0);
  };

  const filteredEmployees = employees.filter((emp) => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name.toLowerCase().includes(term) ||
      (emp.accountId && emp.accountId.email || "").toLowerCase().includes(term) ||
      (emp.roleTag || "").toLowerCase().includes(term)
    );
  });

  const grantUserAccess = async () => {
    try {
      const res = await fetch(
        "https://back-end-hk2p.onrender.com/api/admin/access-control/grant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: selectedUserId,
            roles: rolesInput.split(',').map(role => role.trim()),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Cấp quyền thất bại");
      }
      toast.success("Cấp quyền thành công");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateUserAccess = async () => {
    try {
      const res = await fetch(
        "https://back-end-hk2p.onrender.com/api/admin/access-control/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            userId: selectedUserId,
            roles: rolesInput.split(',').map(role => role.trim()),
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Cập nhật quyền thất bại");
      }
      toast.success("Cập nhật quyền thành công");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteUserAccess = async () => {
    toast.info(`Đang thực hiện xóa quyền của người dùng.`, {
      autoClose: 2000,
    });
    try {
      const res = await fetch(
        `https://back-end-hk2p.onrender.com/api/admin/access-control/delete/${selectedUserId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Xóa quyền thất bại");
      }
      toast.success("Xóa quyền thành công");
    } catch (err) {
      toast.error(err.message);
    }
  };


  const addDepartment = async () => {
    try {
      const res = await fetch("https://back-end-hk2p.onrender.com/api/departs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: departmentName,
          code: departmentCode,
          describe: departmentDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Tạo phòng ban thất bại");
      }
      toast.success("Tạo phòng ban thành công!"); // Success toast
      // Clear form fields
      setDepartmentName("");
      setDepartmentCode("");
      setDepartmentDesc("");
      setActiveForm(null);
    } catch (err) {
      toast.error(err.message);
    }
  };


  const handleAddEmployee = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (newEmployeePassword !== newEmployeeConfirmPassword) {
      toast.error('Mật khẩu và xác nhận mật khẩu không khớp.');
      return;
    }

    try {
      const registerResponse = await fetch('https://back-end-hk2p.onrender.com/api/accounts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Use admin's token for authorization
        },
        body: JSON.stringify({
          email: newEmployeeEmail,
          password: newEmployeePassword,
          confirmPassword: newEmployeeConfirmPassword,
          name: newEmployeeName,
          age: parseInt(newEmployeeAge), // Ensure age is an integer, even if not displayed
          phone: newEmployeePhone,
        }),
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        toast.success(registerData.message || 'Thêm nhân viên thành công!');
        // Step 2: If registration is successful, send verification email
        if (registerData.account && registerData.account.email) {
          try {
            const verifyEmailResponse = await fetch('https://back-end-hk2p.onrender.com/api/accounts/send-verification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`, // Admin's token for this request too
              },
              body: JSON.stringify({ email: registerData.account.email }),
            });

            const verifyEmailData = await verifyEmailResponse.json();

            if (verifyEmailResponse.ok) {
              console.log('Verification email sent successfully:', verifyEmailData);
              toast.success('Thêm nhân viên thành công! Vui lòng kiểm tra email của nhân viên để xác thực tài khoản.');
            } else {
              console.error('Failed to send verification email:', verifyEmailData);
              toast.error(verifyEmailData.message || 'Thêm nhân viên thành công nhưng không gửi được email xác thực. Vui lòng thử lại sau.');
            }
          } catch (verifyEmailError) {
            console.error('Network error or unexpected issue when sending verification email:', verifyEmailError);
            toast.error('Thêm nhân viên thành công nhưng gặp lỗi khi gửi email xác thực. Vui lòng thử lại sau.');
          }
        }

        // Clear form fields
        setNewEmployeeEmail('');
        setNewEmployeePassword('');
        setNewEmployeeConfirmPassword('');
        setNewEmployeeName('');
        setNewEmployeeAge(''); // Clear age state too
        setNewEmployeePhone('');
        setActiveForm(null); // Go back to employee list
        fetchEmployees(); // Re-fetch all employees to update the list
      } else {
        toast.error(registerData.message || 'Thêm nhân viên thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      console.error('Lỗi mạng hoặc vấn đề không mong muốn khi thêm nhân viên:', err);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  const renderEmployeeList = () => {
    if (loading) return <CircularProgress />;
    if (!filteredEmployees.length && !loading)
      return <Typography>Không tìm thấy nhân viên nào.</Typography>;

    return (
      <List>
        {filteredEmployees.map((emp) => (
          <ListItem
            key={emp._id}
            divider
            alignItems="flex-start"
            sx={{ flexDirection: "column", alignItems: "stretch" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Box>
                <Typography fontWeight="bold">{emp.name}</Typography>
                <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                  <EmailIcon fontSize="small" /> {emp.accountId ? emp.accountId.email : 'N/A'}
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <BadgeIcon fontSize="small" /> {emp.roleTag || "Chưa có"}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSelectedUserId(emp._id);
                    setRolesInput(emp.roleTag || "");
                    const role = prompt(
                      "Nhập danh sách role mới (cách nhau bởi dấu phẩy):",
                      emp.roleTag || ""
                    );
                    if (role !== null) { // prompt returns null if cancelled
                      setRolesInput(role);
                      updateUserAccess();
                    }
                  }}
                >
                  Cập nhật
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setSelectedUserId(emp._id);
                    toast.warn(
                        `Bạn có chắc muốn xóa quyền của ${emp.name}? Click nút này để xác nhận.`,
                        {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: false, // Prevent toast from closing on click
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                            onClick: () => { // This acts as a confirmation click on the toast itself
                                deleteUserAccess();
                                toast.dismiss(); // Dismiss the warning toast immediately after "confirmation"
                            }
                        }
                    );
                  }}
                >
                  Xóa quyền
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => {
                    setSelectedUserId(emp._id);
                    const role = prompt(
                      "Nhập roles để cấp quyền (cách nhau bởi dấu phẩy):"
                    );
                    if (role !== null) { // prompt returns null if cancelled
                      setRolesInput(role);
                      grantUserAccess();
                    }
                  }}
                >
                  Cấp quyền
                </Button>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeForm === 'add') {
      handleAddEmployee(e); // Call the new function for adding employee
    } else if (activeForm === 'addDepartment') {
      addDepartment(); // Existing function for adding department
    } else {
      toast.info('Đã gửi form!'); // For other generic forms
      setActiveForm(null); // Go back to the main list after generic submission
    }
  };

  const handleCancel = () => {
    setActiveForm(null);
    // Clear department form fields on cancel
    setDepartmentName("");
    setDepartmentCode("");
    setDepartmentDesc("");
    // Clear new employee form fields on cancel
    setNewEmployeeEmail('');
    setNewEmployeePassword('');
    setNewEmployeeConfirmPassword('');
    setNewEmployeeName('');
    setNewEmployeeAge('');
    setNewEmployeePhone('');
  };

  const renderForm = () => {
    switch (activeForm) {
      case 'add':
        return (
          <Box
            key="form-add"
            component="form"
            className="add-employee-form"
            onSubmit={handleAddEmployee} // Direct submission to handleAddEmployee
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Thêm nhân viên mới
            </Typography>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              size="small"
              margin="normal"
              required
              value={newEmployeeEmail}
              onChange={(e) => setNewEmployeeEmail(e.target.value)}
            />
            <TextField
              label="Họ và tên"
              name="fullName"
              fullWidth
              size="small"
              margin="normal"
              required
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
            />
            {/* Removed the 'Tuổi' field as it's not displayed in Register.jsx */}
            <TextField
              label="Số điện thoại"
              name="phone"
              type="tel"
              fullWidth
              size="small"
              margin="normal"
              value={newEmployeePhone}
              onChange={(e) => setNewEmployeePhone(e.target.value)}
            />
            <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              fullWidth
              size="small"
              margin="normal"
              required
              value={newEmployeePassword}
              onChange={(e) => setNewEmployeePassword(e.target.value)}
            />
            <TextField
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              fullWidth
              size="small"
              margin="normal"
              required
              value={newEmployeeConfirmPassword}
              onChange={(e) => setNewEmployeeConfirmPassword(e.target.value)}
            />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'personalInfo':
        return (
          <Box
            key="form-personalInfo"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quản lý thông tin cá nhân
            </Typography>
            <TextField label="Họ và tên" name="fullName" fullWidth size="small" margin="normal" required />
            <TextField label="Ngày sinh" name="dob" type="date" fullWidth size="small" margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Địa chỉ" name="address" fullWidth size="small" margin="normal" />
            <TextField label="Số CMND/CCCD" name="idNumber" fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'jobInfo':
        return (
          <Box
            key="form-jobInfo"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quản lý thông tin công việc
            </Typography>
            <TextField label="Chức danh" name="title" fullWidth size="small" margin="normal" required />
            <TextField label="Phòng ban" name="department" fullWidth size="small" margin="normal" />
            <TextField label="Ngày bắt đầu" name="startDate" type="date" fullWidth size="small" margin="normal" InputLabelProps={{ shrink: true }} />
            <TextField label="Trạng thái làm việc" name="status" fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'workSchedule':
        return (
          <Box
            key="form-workSchedule"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quản lý lịch làm việc
            </Typography>
            <TextField
              label="Thời gian làm việc bắt đầu"
              name="workStart"
              type="time"
              fullWidth
              size="small"
              margin="normal"
              defaultValue="09:00"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Thời gian làm việc kết thúc"
              name="workEnd"
              type="time"
              fullWidth
              size="small"
              margin="normal"
              defaultValue="18:00"
              InputLabelProps={{ shrink: true }}
            />
            <TextField label="Ca làm việc" name="shift" fullWidth size="small" margin="normal" />
            <TextField label="Ghi chú" name="notes" multiline rows={3} fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'accountInfo':
        return (
          <Box
            key="form-accountInfo"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quản lý tài khoản nhân viên
            </Typography>
            <TextField label="Tên đăng nhập" name="username" fullWidth size="small" margin="normal" required />
            <TextField label="Email liên kết" name="email" type="email" fullWidth size="small" margin="normal" />
            <TextField label="Mật khẩu mới" name="password" type="password" fullWidth size="small" margin="normal" />
            <TextField label="Quyền hạn" name="role" fullWidth size="small" margin="normal" />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      case 'addDepartment':
        return (
          <Box
            key="form-addDepartment"
            component="form"
            className="add-employee-form"
            onSubmit={handleSubmit}
            mt={4}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tạo phòng ban mới
            </Typography>
            <TextField
              label="Tên phòng ban"
              name="departmentName"
              fullWidth size="small" margin="normal"
              required
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
            />
            <TextField
              label="Mã phòng ban"
              name="departmentCode"
              fullWidth size="small" margin="normal"
              required
              value={departmentCode}
              onChange={(e) => setDepartmentCode(e.target.value)}
            />
            <TextField
              label="Miêu tả"
              name="departmentDesc"
              fullWidth size="small" margin="normal"
              multiline
              rows={3}
              value={departmentDesc}
              onChange={(e) => setDepartmentDesc(e.target.value)}
            />
            <Box className="form-buttons">
              <Button type="submit" variant="contained" color="primary">Lưu</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };


  return (
    <Box className="container-main">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Hệ thống Quản lý Nhân viên
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        AD-QLTT01
      </Typography>

      {/* Admin Functions Section */}
      <Box className="function-container">
        <FunctionList onSelectFunction={handleSelectFunction} />
        <Button
          variant="contained"
          color="primary"
          startIcon={<PersonAddIcon />}
          onClick={() => handleSelectFunction('add')}
          className="add-employee-btn"
          sx={{ mt: 3, mb: 1, width: '100%' }}
        >
          Thêm mới nhân viên
        </Button>
      </Box>

      {/* Conditional Rendering of Forms or Employee List */}
      {activeForm ? (
        renderForm()
      ) : (
        <>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
            sx={{ mt: 3 }}
          >
            Danh sách nhân viên
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Quản lý thông tin tất cả nhân viên trong hệ thống
          </Typography>
          <Box
            className="search-row"
            mb={2}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                // Filtering happens automatically with `searchTerm` state
              }}
            >
              Lọc
            </Button>
          </Box>
          {renderEmployeeList()}
        </>
      )}
    </Box>
  );
};

export default Admin;
