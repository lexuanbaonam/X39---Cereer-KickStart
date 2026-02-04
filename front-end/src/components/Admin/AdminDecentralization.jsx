import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Button,
  Tab,
  Tabs,
  Box,
  TextField,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailIcon from "@mui/icons-material/Email";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"; // Added for delete icon
import { toast } from "react-toastify";
import axiosClient from '../../api/axiosClient';
import "./AdminDecentralization.css"; // Assuming this CSS file exists

const AdminDecentralization = ({ authToken, currentUser, currentAccount }) => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");

  // State for editing user modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // Stores the full user object being edited
  const [editFormData, setEditFormData] = useState({
    name: "",
    personalEmail: "",
    companyEmail: "",
    phoneNumber: "",
    dob: "", // Date of Birth
    roleTag: "", // User's role tag (LEADER, MEMBER, ADMIN)
    departs: [], // Array of department IDs
    jobPosition: [], // Array of job position IDs
    active: true, // Account active status
  });
  const [fetchingUserForEdit, setFetchingUserForEdit] = useState(false); // New loading state for fetching single user
  const [isFormDisabled, setIsFormDisabled] = useState(true); // New state to control form editability

  // State for delete confirmation dialog
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Stores the user object to be deleted

  // States for available departments and job positions
  const [availableDeparts, setAvailableDeparts] = useState([]);
  const [availableJobPositions, setAvailableJobPositions] = useState([]);
  const fetchingDepartsRef = useRef(false); // Ref to prevent duplicate fetches
  const fetchingJobPositionsRef = useRef(false); // Ref to prevent duplicate fetches

  // Function to fetch all users
  const fetchAllUsers = useCallback(async () => {
    if (!authToken) {
      toast.error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
      return;
    }
    setLoading(true);
    setLoading(true);
    try {
      const data = await axiosClient.get("/users/all");
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Lỗi mạng hoặc server khi tải danh sách người dùng.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Function to fetch all departments
  const fetchAllDeparts = useCallback(async () => {
    if (fetchingDepartsRef.current) return; // Prevent duplicate fetches
    fetchingDepartsRef.current = true;
    fetchingDepartsRef.current = true;
    try {
      const data = await axiosClient.get("/departs/all");
      // Corrected: Access data from 'data' key as per your API response
      setAvailableDeparts(data.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error(error.response?.data?.message || "Lỗi mạng hoặc server khi tải danh sách phòng ban.");
    } finally {
      fetchingDepartsRef.current = false;
    }
  }, [authToken]);

  // Function to fetch all job positions
  const fetchAllJobPositions = useCallback(async () => {
    if (fetchingJobPositionsRef.current) return; // Prevent duplicate fetches
    fetchingJobPositionsRef.current = true;
    fetchingJobPositionsRef.current = true;
    try {
      const data = await axiosClient.get("/job-positions/all");
      // Assuming job positions have _id and title properties
      setAvailableJobPositions(data.jobPositions || []);
    } catch (error) {
      console.error("Error fetching job positions:", error);
      toast.error(error.response?.data?.message || "Lỗi mạng hoặc server khi tải danh sách chức vụ.");
    } finally {
      fetchingJobPositionsRef.current = false;
    }
  }, [authToken]);

  // Initial data fetch when component mounts or tab changes
  useEffect(() => {
    if (tabValue === 0) { // Fetch users, departments, and job positions when the "Người dùng" tab is active
      fetchAllUsers();
      fetchAllDeparts();
      fetchAllJobPositions();
    }
  }, [tabValue, fetchAllUsers, fetchAllDeparts, fetchAllJobPositions]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      user.name.toLowerCase().includes(searchTermLower) ||
      (user.accountId && user.accountId.email.toLowerCase().includes(searchTermLower)) ||
      (user.roleTag || "").toLowerCase().includes(searchTermLower);

    const matchesRole =
      selectedRoleFilter === "all" ||
      (user.accountId && user.accountId.role === selectedRoleFilter);

    return matchesSearch && matchesRole;
  });

  const allRoles = [...new Set(users.map(user => user.accountId?.role).filter(Boolean))];

  // Function to open the edit modal and fetch user data
  const handleEditClick = async (userId) => {
    if (!authToken) {
      toast.error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
      return;
    }
    setFetchingUserForEdit(true);
    setIsFormDisabled(true); // Disable form immediately
    setIsEditModalOpen(true); // Open modal immediately with loading indicator

    // Ensure departments and job positions are fetched before attempting to populate the form
    // This is crucial if the initial useEffect hasn't completed or if data is stale.
    await fetchAllDeparts();
    await fetchAllJobPositions();

    try {
      const data = await axiosClient.get(`/users/${userId}`);
      const user = data.user;
      setEditingUser(user);
      // Format dob for input type="date"
      const formattedDob = user.dob ? new Date(user.dob).toISOString().split('T')[0] : '';

      // Map jobPosition and departs to an array of their _id values
      const userJobPositions = user.jobPosition ? user.jobPosition.map(jp => jp._id) : [];
      const userDeparts = user.departs ? user.departs.map(d => d._id) : [];

      setEditFormData({
        name: user.name || "",
        personalEmail: user.personalEmail || "",
        companyEmail: user.companyEmail || "",
        phoneNumber: user.phoneNumber || "",
        dob: formattedDob,
        roleTag: user.roleTag || "",
        departs: userDeparts,
        jobPosition: userJobPositions,
        active: user.accountId?.active || false, // Get active status from account
      });

      // Delay enabling the form for 2 seconds for a smoother UX after data loads
      setTimeout(() => {
        setIsFormDisabled(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching user for edit:", error);
      toast.error(error.response?.data?.message || "Lỗi mạng hoặc server khi tải thông tin người dùng.");
      handleCloseEditModal(); // Close modal on error
    } finally {
      setFetchingUserForEdit(false);
    }
  };

  // Function to close the edit modal
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    setEditFormData({
      name: "",
      personalEmail: "",
      companyEmail: "",
      phoneNumber: "",
      dob: "",
      roleTag: "",
      departs: [],
      jobPosition: [],
      active: true,
    });
    setIsFormDisabled(true); // Reset form disabled state
  };

  // Handle form data changes for single-value fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle multi-select for departs and jobPosition
  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      // Ensure value is an array, as multi-select returns an array
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  // Function to submit updated user data
  const handleUpdateUser = async () => {
    if (!editingUser || !authToken) {
      toast.error("Lỗi: Không có người dùng hoặc token xác thực.");
      return;
    }

    setLoading(true); // Set main loading for the update operation
    try {
      const data = await axiosClient.put(`/users/${editingUser._id}`, {
        ...editFormData,
        // Ensure DOB is sent as a valid ISO string if it exists
        dob: editFormData.dob ? new Date(editFormData.dob).toISOString() : undefined,
      });

      toast.success(data.message || "Cập nhật thông tin người dùng thành công!");
      fetchAllUsers(); // Re-fetch all users to update the list with latest changes
      handleCloseEditModal(); // Close the modal
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Lỗi mạng hoặc server khi cập nhật người dùng.");
    } finally {
      setLoading(false);
    }
  };

  // Function to open delete confirmation dialog
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  };

  // Function to close delete confirmation dialog
  const handleCloseDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setUserToDelete(null);
  };

  // Function to handle actual user deletion
  const handleConfirmDelete = async () => {
    if (!userToDelete || !authToken) {
      toast.error("Lỗi: Không có người dùng hoặc token xác thực.");
      return;
    }

    setLoading(true);
    try {
      const data = await axiosClient.delete(`/admin/access-control/delete/${userToDelete._id}`);

      toast.success(data.message || "Xóa người dùng thành công!");
      fetchAllUsers(); // Re-fetch all users to update the list
      handleCloseDeleteConfirm(); // Close the confirmation dialog
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Lỗi mạng hoặc server khi xóa người dùng.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box className="admin-container">
      <Box className="tabs-wrapper">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="primary"
          className="tabs"
        >
          <Tab label="Người dùng" />
          <Tab label="Vai trò & Quyền hạn" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box className="content">
          <Box className="toolbar">
            <TextField
              size="small"
              placeholder="Tìm kiếm người dùng..."
              className="search-input"
              InputProps={{ style: { color: "#000" } }}
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              size="small"
              defaultValue="all"
              className="role-select"
              inputProps={{ style: { color: "#000" } }}
              variant="outlined"
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
            >
              <MenuItem value="all">Tất cả vai trò</MenuItem>
              {allRoles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </Box>

          <Box className="table-container">
            <Box className="table-header">
              <div style={{ "paddingLeft": "50px" }}>NGƯỜI DÙNG</div>
              <div>VAI TRÒ</div>
              <div>TRẠNG THÁI</div>
              <div>HÀNH ĐỘNG</div>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </Box>
            ) : filteredUsers.length > 0 ? (
              <List className="user-list">
                {filteredUsers.map((user) => (
                  <ListItem key={user._id} className="user-list-item">
                    <Box sx={{ flex: '3 1 0%', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonOutlineIcon fontSize="small" />
                      <Box>
                        <Typography variant="body1" fontWeight="bold">{user.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          <EmailIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                          {user.accountId ? user.accountId.email : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: '1 1 0%' }}>
                      <Typography variant="body2">{user.accountId ? user.accountId.role : 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 0%', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {user.accountId?.active ? (
                        <>
                          <LockOpenIcon fontSize="small" color="success" />
                          <Typography variant="body2" color="success">Hoạt động</Typography>
                        </>
                      ) : (
                        <>
                          {/* BlockIcon đã được xóa khỏi đây */}
                          <Typography variant="body2" color="error">Không hoạt động</Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ flex: '1 1 0%', display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleEditClick(user._id)} // Pass user._id
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(user)} // Pass the full user object
                      >
                        <DeleteOutlineIcon fontSize="small" sx={{ mr: 0.5 }} /> Xóa
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box className="empty-state">
                <Box className="empty-icon">👥</Box>
                <Box className="empty-title">Chưa có người dùng</Box>
                <Box className="empty-desc">
                  Bắt đầu bằng cách thêm người dùng đầu tiên
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}

      {tabValue === 1 && (
        <Box className="content">
          <Typography variant="h6">Quản lý vai trò & Quyền hạn</Typography>
          <Typography variant="body2" color="textSecondary">
            Đây là nơi bạn có thể định nghĩa và quản lý các vai trò (roles) và quyền hạn (permissions) trong hệ thống.
          </Typography>
        </Box>
      )}

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
        <DialogContent>
          {fetchingUserForEdit ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Đang tải thông tin người dùng...</Typography>
            </Box>
          ) : editingUser ? (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                margin="dense"
                name="name"
                label="Họ và tên"
                type="text"
                fullWidth
                variant="outlined"
                value={editFormData.name}
                onChange={handleFormChange}
                disabled={isFormDisabled}
              />
              <TextField
                margin="dense"
                name="personalEmail"
                label="Email cá nhân"
                type="email"
                fullWidth
                variant="outlined"
                value={editFormData.personalEmail}
                onChange={handleFormChange}
                disabled={isFormDisabled}
              />
              <TextField
                margin="dense"
                name="companyEmail"
                label="Email công ty"
                type="email"
                fullWidth
                variant="outlined"
                value={editFormData.companyEmail}
                onChange={handleFormChange}
                disabled={isFormDisabled}
              />
              <TextField
                margin="dense"
                name="phoneNumber"
                label="Số điện thoại"
                type="tel"
                fullWidth
                variant="outlined"
                value={editFormData.phoneNumber}
                onChange={handleFormChange}
                disabled={isFormDisabled}
              />
              <TextField
                margin="dense"
                name="dob"
                label="Ngày sinh"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={editFormData.dob}
                onChange={handleFormChange}
                disabled={isFormDisabled}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="roleTag"
                  value={editFormData.roleTag}
                  label="Vai trò"
                  onChange={handleFormChange}
                  disabled={isFormDisabled}
                >
                  <MenuItem value="MEMBER">MEMBER</MenuItem>
                  <MenuItem value="LEADER">LEADER</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <InputLabel>Phòng ban</InputLabel>
                <Select
                  name="departs"
                  multiple
                  value={editFormData.departs}
                  label="Phòng ban"
                  onChange={handleMultiSelectChange}
                  // Render selected department titles (corrected from 'name' to 'title')
                  renderValue={(selected) => selected.map(id => availableDeparts.find(d => d._id === id)?.title || '').join(', ')}
                  disabled={isFormDisabled}
                >
                  {availableDeparts.map((depart) => (
                    // Use depart.title for display (corrected from 'name' to 'title')
                    <MenuItem key={depart._id} value={depart._id}>
                      {depart.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <InputLabel>Chức vụ</InputLabel>
                <Select
                  name="jobPosition"
                  multiple
                  value={editFormData.jobPosition}
                  label="Chức vụ"
                  onChange={handleMultiSelectChange}
                  // Render selected job position titles
                  renderValue={(selected) => selected.map(id => availableJobPositions.find(jp => jp._id === id)?.title || '').join(', ')}
                  disabled={isFormDisabled}
                >
                  {availableJobPositions.map((job) => (
                    <MenuItem key={job._id} value={job._id}>
                      {job.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="dense">
                <InputLabel>Trạng thái tài khoản</InputLabel>
                <Select
                  name="active"
                  value={editFormData.active}
                  label="Trạng thái tài khoản"
                  onChange={handleFormChange}
                  disabled={isFormDisabled}
                >
                  <MenuItem value={true}>Hoạt động</MenuItem>
                  <MenuItem value={false}>Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Typography>Không tìm thấy thông tin người dùng.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal} color="secondary">
            Hủy
          </Button>
          <Button onClick={handleUpdateUser} color="primary" variant="contained" disabled={fetchingUserForEdit || isFormDisabled}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa người dùng{" "}
            <Typography component="span" fontWeight="bold">
              {userToDelete?.name}
            </Typography>{" "}
            (Email:{" "}
            <Typography component="span" fontWeight="bold">
              {userToDelete?.accountId?.email}
            </Typography>
            )? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm} color="primary">
            Hủy
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDecentralization;
