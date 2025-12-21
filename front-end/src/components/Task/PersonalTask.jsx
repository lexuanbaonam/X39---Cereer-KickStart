import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  useTheme,
  Chip,
  Avatar,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  styled,
  Paper,
  Grid,
  List, // Import List for popup
  ListItem, // Import ListItem for popup
  ListItemAvatar, // Import ListItemAvatar for popup
  ListItemText, // Import ListItemText for popup
} from "@mui/material";
import {
  AddCircleOutline as AddCircleOutlineIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Assignment as TaskIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Info as InfoIcon, // For assignees popup
} from "@mui/icons-material";
import { toast } from "react-toastify";

const API_BASE_URL = "https://back-end-hk2p.onrender.com/api";
const LOADING_DELAY_MS = 1000;

// Styled Components (Adapted from SprintsPage.jsx)
const Root = styled(Box)({
  minHeight: '100vh',
  background: 'white',
  padding: '24px',
});

const MainContainer = styled(Paper)({
  maxWidth: '1000px',
  margin: '0 auto',
  borderRadius: '24px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  overflow: 'hidden',
});

const Header = styled(Box)({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '48px 32px',
  textAlign: 'center',
  color: 'white',
});

const HeaderTitle = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 700,
  marginBottom: '16px',
  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
});

const HeaderSubtitle = styled(Typography)({
  fontSize: '1.2rem',
  opacity: 0.9,
});

const ContentContainer = styled(Box)({
  padding: '32px',
});

const ActionBar = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  gap: '16px',
  flexWrap: 'wrap', // Allow wrapping on smaller screens
});

const CreateButton = styled(Button)({
  borderRadius: '12px',
  padding: '12px 32px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'white',
  boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.3s ease',
  color: '#667eea', // Text color to match gradient
  '&:hover': {
    background: 'white',
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)',
  },
});

const TaskCard = styled(Paper)({
  margin: '16px 0',
  borderRadius: '16px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
});

const TaskTitle = styled(Typography)({
  fontSize: '1.4rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
});

const TaskDescription = styled(Typography)({
  color: '#6c757d',
  fontSize: '1rem',
  lineHeight: 1.6,
  marginBottom: '16px',
});

const DateInfo = styled(Typography)({
  color: '#495057',
  fontSize: '0.95rem',
  fontWeight: 500,
  marginBottom: '4px',
});

const StyledChip = styled(Chip)(({ customstatus, custompriority }) => ({
  borderRadius: '20px',
  fontWeight: 600,
  fontSize: '0.85rem',
  height: '32px',
  // Status specific colors
  ...(customstatus === 'notstarted' && {
    background: 'linear-gradient(45deg, #6c757d, #495057)', // default
    color: 'white',
  }),
  ...(customstatus === 'inprogress' && {
    background: 'linear-gradient(45deg, #007bff, #6f42c1)', // info
    color: 'white',
  }),
  ...(customstatus === 'complete' && {
    background: 'linear-gradient(45deg, #28a745, #20c997)', // success
    color: 'white',
  }),
  ...(customstatus === 'submitted' && {
    background: 'linear-gradient(45deg, #17a2b8, #007bff)', // primary (adjusted for contrast)
    color: 'white',
  }),
  ...(customstatus === 'needsreview' && {
    background: 'linear-gradient(45deg, #ffc107, #fd7e14)', // warning
    color: 'white',
  }),
  ...(customstatus === 'overdue' && {
    background: 'linear-gradient(45deg, #dc3545, #c82333)', // error
    color: 'white',
  }),
  ...(customstatus === 'onhold' && {
    background: 'linear-gradient(45deg, #ffc107, #fd7e14)', // warning
    color: 'white',
  }),
  // Priority specific colors
  ...(custompriority === 'low' && {
    background: 'linear-gradient(45deg, #6c757d, #495057)', // default
    color: 'white',
  }),
  ...(custompriority === 'medium' && {
    background: 'linear-gradient(45deg, #007bff, #6f42c1)', // info
    color: 'white',
  }),
  ...(custompriority === 'high' && {
    background: 'linear-gradient(45deg, #ffc107, #dc3545)', // warning (adjusted for high priority)
    color: 'white',
  }),
}));

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '8px',
});

const ActionIconButton = styled(IconButton)(({ customcolor }) => ({
  borderRadius: '10px',
  padding: '8px',
  transition: 'all 0.3s ease',
  ...(customcolor === 'delete' && {
    color: '#dc3545',
    '&:hover': {
      backgroundColor: 'rgba(220, 53, 69, 0.1)',
      transform: 'scale(1.1)',
    },
  }),
  ...(customcolor === 'edit' && {
    color: '#667eea',
    '&:hover': {
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      transform: 'scale(1.1)',
    },
  }),
}));

const EmptyState = styled(Paper)({
  padding: '64px 32px',
  textAlign: 'center',
  borderRadius: '16px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: '2px dashed rgba(102, 126, 234, 0.3)',
});

const EmptyStateIcon = styled(Box)({
  fontSize: '4rem',
  marginBottom: '24px',
  opacity: 0.5,
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
});

const LoadingContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  padding: '48px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '8px',
  },
});

const DialogButton = styled(Button)(({ variant }) => ({
  borderRadius: '8px',
  padding: '8px 24px',
  fontWeight: 600,
  textTransform: 'none',
  ...(variant === 'primary' && {
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #764ba2, #667eea)',
    },
  }),
  ...(variant === 'delete' && {
    background: 'linear-gradient(45deg, #dc3545, #c82333)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #c82333, #a71e2a)',
    },
  }),
}));


function PersonalTask({ authToken, setCurrentPage, currentUserId }) {
  const [openForm, setOpenForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [selectedDepartId, setSelectedDepartId] = useState("");
  const [sprints, setSprints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loadingSprints, setLoadingSprints] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingMyTasks, setLoadingMyTasks] = useState(true);
  const [loadingTaskCreation, setLoadingTaskCreation] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [error, setError] = useState(null);

  const [openEditForm, setOpenEditForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editSelectedSprintId, setEditSelectedSprintId] = useState("");
  const [editSelectedDepartId, setEditSelectedDepartId] = useState("");
  const [editTaskStatus, setEditTaskStatus] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState("");
  const [loadingTaskUpdate, setLoadingTaskUpdate] = useState(false);

  // New state for users and selected assignees
  const [users, setUsers] = useState([]);
  const [editSelectedAssignees, setEditSelectedAssignees] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // State for assignees popup
  const [openAssigneesPopup, setOpenAssigneesPopup] = useState(false);
  const [currentAssigneesForPopup, setCurrentAssigneesForPopup] = useState([]);

  const theme = useTheme();

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // --- Fetch Sprints ---
  const fetchSprints = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingSprints(false);
      return;
    }

    setLoadingSprints(true);
    try {
      const response = await fetch(`${API_BASE_URL}/sprints/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách sprint");
      }

      const data = await response.json();
      const sprintArray = data.sprints;
      if (Array.isArray(sprintArray)) {
        setSprints(sprintArray);
        if (!selectedSprintId && sprintArray.length > 0) {
          setSelectedSprintId(sprintArray[0]?._id || "");
        }
      } else {
        toast.error("Dữ liệu sprint trả về không hợp lệ.");
        setSprints([]);
        setSelectedSprintId("");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sprint:", err);
      setError((prev) => prev ? new Error(`${prev.message}\n${err.message}`) : err);
      toast.error(`Lỗi khi tải danh sách sprint: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingSprints(false);
    }
  }, [authToken, selectedSprintId]);

  // --- Fetch Departments ---
  const fetchDepartments = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingDepartments(false);
      return;
    }

    setLoadingDepartments(true);
    try {
      const response = await fetch(`${API_BASE_URL}/departs/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách phòng ban");
      }

      const responseData = await response.json();
      const departmentArray = responseData.data;
      if (Array.isArray(departmentArray)) {
        setDepartments(departmentArray);
        if (!selectedDepartId && departmentArray.length > 0) {
          setSelectedDepartId(departmentArray[0]?._id || "");
        }
      } else {
        toast.error("Dữ liệu phòng ban trả về không hợp lệ.");
        setDepartments([]);
        setSelectedDepartId("");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách phòng ban:", err);
      setError((prev) => prev ? new Error(`${prev.message}\n${err.message}`) : err);
      toast.error(`Lỗi khi tải danh sách phòng ban: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingDepartments(false);
    }
  }, [authToken, selectedDepartId]);

  // --- Fetch My Tasks ---
  const fetchMyTasks = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingMyTasks(false);
      return;
    }

    setLoadingMyTasks(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/my-tasks`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách task cá nhân");
      }

      const data = await response.json();
      const tasksArray = data.tasks;
      if (Array.isArray(tasksArray)) {
        setMyTasks(tasksArray);
      } else {
        toast.error("Dữ liệu task cá nhân trả về không hợp lệ.");
        setMyTasks([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách task cá nhân:", err);
      setError((prev) => prev ? new Error(`${prev.message}\n${err.message}`) : err);
      toast.error(`Lỗi khi tải danh sách task cá nhân: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingMyTasks(false);
    }
  }, [authToken]);

  // --- New: Fetch Users for Assignees ---
  const fetchUsers = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingUsers(false);
      return;
    }
    setLoadingUsers(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/all`, { // Assuming an API endpoint to get all users
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách người dùng");
      }
      const data = await response.json();
      // Assuming data.users contains an array of user objects with _id and name
      if (Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        toast.error("Dữ liệu người dùng trả về không hợp lệ.");
        setUsers([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
      setError((prev) => prev ? new Error(`${prev.message}\n${err.message}`) : err);
      toast.error(`Lỗi khi tải danh sách người dùng: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingUsers(false);
    }
  }, [authToken]);

  // Fetch all necessary data on component mount
  useEffect(() => {
    fetchSprints();
    fetchDepartments();
    fetchMyTasks();
    fetchUsers(); // Fetch users when component mounts
  }, [fetchSprints, fetchDepartments, fetchMyTasks, fetchUsers]);

  const handleOpenForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setSelectedSprintId(sprints[0]?._id || "");
    setSelectedDepartId(departments[0]?._id || "");
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setTaskTitle("");
    setTaskDescription("");
    setSelectedSprintId(sprints[0]?._id || "");
    setSelectedDepartId(departments[0]?._id || "");
  };

  const handleCreateTask = async () => {
    if (!taskTitle || !selectedDepartId) {
      toast.warn("Vui lòng điền Tiêu đề, chọn Sprint và Phòng ban.");
      return;
    }
    if (!currentUserId) {
      toast.error("Không thể tạo task: Thông tin người dùng không có sẵn. Vui lòng đăng nhập lại.");
      return;
    }

    setLoadingTaskCreation(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            departId: selectedDepartId,
            assignees: [currentUserId], // Gán cho chính người tạo ban đầu
            title: taskTitle,
            description: taskDescription,
            sprintId: selectedSprintId,
          }),
        }
      );

      const data = await response.json();
      if (response.status === 201) {
        toast.success("Tạo task thành công!");
        handleCloseForm();
        fetchMyTasks();
      } else {
        toast.error(`Lỗi khi tạo task: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi khi tạo task:", err);
      toast.error(`Lỗi khi tạo task: ${err.message}`);
    } finally {
      setLoadingTaskCreation(false);
    }
  };

  // --- Delete Task ---
  const handleDeleteTask = async (taskId) => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      return;
    }

    setDeletingTaskId(taskId);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        toast.success("Xóa task thành công!");
        fetchMyTasks();
      } else {
        const errorData = await response.json();
        toast.error(`Lỗi khi xóa task: ${errorData.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi khi xóa task:", err);
      toast.error(`Lỗi khi xóa task: ${err.message}`);
    } finally {
      setDeletingTaskId(null);
    }
  };

  // --- Handle opening edit form ---
  const handleOpenEditForm = (task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || "");
    setEditSelectedSprintId(task.sprintId?._id || "");
    setEditSelectedDepartId(task.departId?._id || "");
    setEditTaskStatus(task.status || "NOTSTARTED");
    setEditTaskPriority(task.priority || "MEDIUM");
    setEditSelectedAssignees(task.assignees?.map(assignee => assignee._id) || []);
    setOpenEditForm(true);
  };

  // --- Handle closing edit form ---
  const handleCloseEditForm = () => {
    setOpenEditForm(false);
    setEditingTask(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditSelectedSprintId("");
    setEditSelectedDepartId("");
    setEditTaskStatus("");
    setEditTaskPriority("");
    setEditSelectedAssignees([]); // Reset assignees selection
  };

  // --- Handle updating task ---
  const handleUpdateTask = async () => {
    if (!editingTask || !editTaskTitle || !editSelectedSprintId || !editSelectedDepartId) {
      toast.warn("Vui lòng điền Tiêu đề, chọn Sprint và Phòng ban cho task đang chỉnh sửa.");
      return;
    }
    if (editSelectedAssignees.length === 0) {
      toast.warn("Vui lòng chọn ít nhất một người được giao.");
      return;
    }

    setLoadingTaskUpdate(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/tasks/${editingTask._id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            title: editTaskTitle,
            description: editTaskDescription,
            sprintId: editSelectedSprintId,
            departId: editSelectedDepartId,
            status: editTaskStatus.toUpperCase(),
            priority: editTaskPriority.toUpperCase(),
            assignees: editSelectedAssignees, // Gửi mảng các ID người dùng đã chọn
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Cập nhật task thành công!");
        handleCloseEditForm();
        fetchMyTasks();
      } else {
        toast.error(`Lỗi khi cập nhật task: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật task:", err);
      toast.error(`Lỗi khi cập nhật task: ${err.message}`);
    } finally {
      setLoadingTaskUpdate(false);
    }
  };

  // Handle change for multi-select assignees
  const handleChangeAssignees = (event) => {
    const {
      target: { value },
    } = event;
    setEditSelectedAssignees(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  // Handle opening assignees popup
  const handleOpenAssigneesPopup = (assignees) => {
    setCurrentAssigneesForPopup(assignees);
    setOpenAssigneesPopup(true);
  };

  // Handle closing assignees popup
  const handleCloseAssigneesPopup = () => {
    setOpenAssigneesPopup(false);
    setCurrentAssigneesForPopup([]);
  };

  // Combine loading states for initial render
  if (loadingSprints || loadingDepartments || loadingMyTasks || loadingUsers) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <CircularProgress size={48} sx={{ color: '#667eea' }} />
          <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
            Đang tải dữ liệu...
          </Typography>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  // Handle errors for any fetch operation after initial load attempt
  if (error) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Typography color="error" variant="h6" sx={{ marginBottom: 3 }}>
            Đã xảy ra lỗi: {error.message || "Lỗi không xác định"}
          </Typography>
          <CreateButton onClick={() => {
            setError(null);
            fetchSprints();
            fetchDepartments();
            fetchMyTasks();
            fetchUsers();
          }}>
            Thử lại
          </CreateButton>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  const getStatusChipValue = (status) => {
    return status?.toLowerCase(); // Return lowercase status for customprop
  };

  const getPriorityChipValue = (priority) => {
    return priority?.toLowerCase(); // Return lowercase priority for customprop
  };

  const formatVietnameseDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  return (
    <Root>
      <MainContainer elevation={0}>
        <Header>
          <HeaderTitle variant="h3">
            Quản lý Task Cá Nhân
          </HeaderTitle>
          <HeaderSubtitle variant="h6">
            Theo dõi và quản lý các công việc của bạn
          </HeaderSubtitle>
        </Header>

        <ContentContainer>
          <ActionBar>
            <Typography variant="h5" sx={{
              fontWeight: 600,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Các Task của bạn ({myTasks.length})
            </Typography>
            <CreateButton
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleOpenForm}
            >
              Tạo Task Mới
            </CreateButton>
          </ActionBar>

          {myTasks.length === 0 ? (
            <EmptyState elevation={0}>
              <EmptyStateIcon>
                <TaskIcon sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
              </EmptyStateIcon>
              <Typography variant="h5" sx={{
                fontWeight: 600,
                marginBottom: 2,
                color: '#6c757d'
              }}>
                Bạn chưa có task nào
              </Typography>
              <Typography variant="body1" sx={{
                color: '#6c757d',
                marginBottom: 3,
                fontSize: '1.1rem'
              }}>
                Hãy tạo một task mới để bắt đầu!
              </Typography>
              <CreateButton
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenForm}
              >
                Tạo Task Đầu Tiên
              </CreateButton>
            </EmptyState>
          ) : (
            <Box>
              {myTasks.map((task) => {
                // Find department title
                const department = departments.find(dep => dep._id === task.departId);
                const departmentTitle = department ? department.title : "N/A";

                return (
                  <TaskCard key={task._id} elevation={0}>
                    <Box sx={{ padding: '24px' }}>
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '16px',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}>
                        <Box sx={{ flex: 1, minWidth: '200px' }}>
                          <TaskTitle>
                            {task.title}
                          </TaskTitle>
                          <TaskDescription>
                            {task.description || "Không có mô tả."}
                          </TaskDescription>
                        </Box>
                        <ActionButtons>
                          <StyledChip
                            label={task.status?.toUpperCase().replace(/_/g, ' ')}
                            customstatus={getStatusChipValue(task.status)}
                            size="medium"
                          />
                          <StyledChip
                            label={`${task.priority?.toUpperCase()}`}
                            custompriority={getPriorityChipValue(task.priority)}
                            size="medium"
                          />
                          <ActionIconButton
                            customcolor="edit"
                            aria-label="edit task"
                            onClick={() => handleOpenEditForm(task)}
                          >
                            <EditIcon />
                          </ActionIconButton>
                          <ActionIconButton
                            customcolor="delete"
                            aria-label="delete task"
                            onClick={() => handleDeleteTask(task._id)}
                            disabled={deletingTaskId === task._id}
                          >
                            {deletingTaskId === task._id ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteIcon />
                            )}
                          </ActionIconButton>
                        </ActionButtons>
                      </Box>

                      <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
                        <Grid item xs={12} sm={6}>
                          <DateInfo>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 24, height: 24 }}>
                                <PersonIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              Tạo bởi: {task.createdBy?.name || "N/A"}
                            </Box>
                          </DateInfo>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DateInfo>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 24, height: 24 }}>
                                <CalendarIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              Ngày tạo: {formatVietnameseDate(task.createdAt)}
                            </Box>
                          </DateInfo>
                        </Grid>
                        {task.assignees && task.assignees.length > 0 && (
                          <Grid item xs={12} sm={6}>
                            <DateInfo sx={{ cursor: 'pointer' }} onClick={() => handleOpenAssigneesPopup(task.assignees)}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ bgcolor: theme.palette.success.main, width: 24, height: 24 }}>
                                  <PersonIcon sx={{ fontSize: 16 }} />
                                </Avatar>
                                Người được giao: {task.assignees.length} người <InfoIcon sx={{ fontSize: 16, ml: 0.5 }} />
                              </Box>
                            </DateInfo>
                          </Grid>
                        )}
                        {task.departId && (
                          <Grid item xs={12} sm={6}>
                            <DateInfo>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ bgcolor: theme.palette.info.main, width: 24, height: 24 }}>
                                  <TaskIcon sx={{ fontSize: 16 }} />
                                </Avatar>
                                Phòng ban: {departmentTitle}
                              </Box>
                            </DateInfo>
                          </Grid>
                        )}
                        {task.sprintId && (
                          <Grid item xs={12} sm={6}>
                            <DateInfo>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 24, height: 24 }}>
                                  <CalendarIcon sx={{ fontSize: 16 }} />
                                </Avatar>
                                Sprint: {task.sprintId?.title || "N/A"}
                              </Box>
                            </DateInfo>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </TaskCard>
                );
              })}
            </Box>
          )}
        </ContentContainer>
      </MainContainer>

      {/* Dialog for Creating New Task */}
      <StyledDialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: 'white',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
        }}>
          Tạo Task Mới
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <TextField
            autoFocus
            label="Tiêu đề Task"
            fullWidth
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
            required
          />
          <TextField
            select
            label="Chọn Phòng ban"
            fullWidth
            value={selectedDepartId}
            onChange={(e) => setSelectedDepartId(e.target.value)}
            sx={{ mb: 2 }}
            required
            disabled={departments.length === 0}
          >
            {departments.length === 0 ? (
              <MenuItem value="">Không có Phòng ban nào khả dụng</MenuItem>
            ) : (
              departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.title}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            select
            label="Chọn Sprint"
            fullWidth
            value={selectedSprintId}
            onChange={(e) => setSelectedSprintId(e.target.value)}
            sx={{ mb: 2 }}
            required
            disabled={sprints.length === 0}
          >
            {sprints.length === 0 ? (
              <MenuItem value="">Không có Sprint nào khả dụng</MenuItem>
            ) : (
              sprints.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.title}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            label="Mô tả Task"
            fullWidth
            multiline
            rows={4}
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseForm} color="secondary" variant="outlined" sx={{
            borderRadius: '8px',
            padding: '8px 24px',
            fontWeight: 600,
            textTransform: 'none'
          }}>
            Hủy
          </Button>
          <DialogButton
            variant="primary"
            onClick={handleCreateTask}
            disabled={loadingTaskCreation}
            startIcon={loadingTaskCreation ? <CircularProgress size={20} /> : null}
          >
            {loadingTaskCreation ? "Đang tạo..." : "Tạo Task"}
          </DialogButton>
        </DialogActions>
      </StyledDialog>

      {/* Dialog for Editing Task */}
      <StyledDialog open={openEditForm} onClose={handleCloseEditForm} fullWidth maxWidth="sm">
        <DialogTitle sx={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: 'white',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
        }}>
          Chỉnh sửa Task
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <TextField
            autoFocus
            label="Tiêu đề Task"
            fullWidth
            value={editTaskTitle}
            onChange={(e) => setEditTaskTitle(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
            required
          />
          <TextField
            select
            label="Chọn Phòng ban"
            fullWidth
            value={editSelectedDepartId}
            onChange={(e) => setEditSelectedDepartId(e.target.value)}
            sx={{ mb: 2 }}
            required
            disabled={departments.length === 0}
          >
            {departments.length === 0 ? (
              <MenuItem value="">Không có Phòng ban nào khả dụng</MenuItem>
            ) : (
              departments.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.title}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            select
            label="Chọn Sprint"
            fullWidth
            value={editSelectedSprintId}
            onChange={(e) => setEditSelectedSprintId(e.target.value)}
            sx={{ mb: 2 }}
            required
            disabled={sprints.length === 0}
          >
            {sprints.length === 0 ? (
              <MenuItem value="">Không có Sprint nào khả dụng</MenuItem>
            ) : (
              sprints.map((s) => (
                <MenuItem key={s._id} value={s._id}>
                  {s.title}
                </MenuItem>
              ))
            )}
          </TextField>
          {/* Assignees Multi-select */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="assignees-label">Người được giao</InputLabel>
            <Select
              labelId="assignees-label"
              id="assignees-select"
              multiple
              value={editSelectedAssignees}
              onChange={handleChangeAssignees}
              input={<OutlinedInput label="Người được giao" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => {
                    const user = users.find(u => u._id === value);
                    return <Chip key={value} label={user ? user.name : value} />;
                  })}
                </Box>
              )}
              disabled={users.length === 0}
            >
              {users.length === 0 ? (
                <MenuItem disabled value="">Không có người dùng nào khả dụng</MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user._id} value={user._id}>
                    {user.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <TextField
            select
            label="Trạng thái"
            fullWidth
            value={editTaskStatus}
            onChange={(e) => setEditTaskStatus(e.target.value)}
            sx={{ mb: 2 }}
            required
          >
            <MenuItem value="NOTSTARTED">Chưa bắt đầu</MenuItem>
            <MenuItem value="INPROGRESS">Đang thực hiện</MenuItem>
            <MenuItem value="SUBMITTED">Đã gửi</MenuItem>
            <MenuItem value="NEEDSREVIEW">Cần xem xét</MenuItem>
            <MenuItem value="COMPLETE">Hoàn thành</MenuItem>
            <MenuItem value="OVERDUE">Quá hạn</MenuItem>
            <MenuItem value="ONHOLD">Tạm dừng</MenuItem>
          </TextField>
          <TextField
            select
            label="Mức độ ưu tiên"
            fullWidth
            value={editTaskPriority}
            onChange={(e) => setEditTaskPriority(e.target.value)}
            sx={{ mb: 2 }}
            required
          >
            <MenuItem value="LOW">Thấp</MenuItem>
            <MenuItem value="MEDIUM">Trung bình</MenuItem>
            <MenuItem value="HIGH">Cao</MenuItem>
          </TextField>
          <TextField
            label="Mô tả Task"
            fullWidth
            multiline
            rows={4}
            value={editTaskDescription}
            onChange={(e) => setEditTaskDescription(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseEditForm} color="secondary" variant="outlined" sx={{
            borderRadius: '8px',
            padding: '8px 24px',
            fontWeight: 600,
            textTransform: 'none'
          }}>
            Hủy
          </Button>
          <DialogButton
            variant="primary"
            onClick={handleUpdateTask}
            disabled={loadingTaskUpdate}
            startIcon={loadingTaskUpdate ? <CircularProgress size={20} /> : null}
          >
            {loadingTaskUpdate ? "Đang cập nhật..." : "Cập nhật Task"}
          </DialogButton>
        </DialogActions>
      </StyledDialog>

      {/* Dialog for displaying Assignees */}
      <StyledDialog open={openAssigneesPopup} onClose={handleCloseAssigneesPopup} maxWidth="xs" fullWidth>
        <DialogTitle sx={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: 'white',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
        }}>
          Danh sách Người được giao
        </DialogTitle>
        <DialogContent sx={{ padding: '16px' }}>
          {currentAssigneesForPopup.length > 0 ? (
            <List>
              {currentAssigneesForPopup.map((assignee) => (
                <ListItem key={assignee._id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={assignee.name} secondary={assignee.personalEmail} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Không có người được giao.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '8px 16px' }}>
          <Button onClick={handleCloseAssigneesPopup} color="secondary" variant="outlined" sx={{
            borderRadius: '8px',
            fontWeight: 600,
            textTransform: 'none'
          }}>
            Đóng
          </Button>
        </DialogActions>
      </StyledDialog>
    </Root>
  );
}

export default PersonalTask;
