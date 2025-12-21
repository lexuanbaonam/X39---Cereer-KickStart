import React, { useState, useEffect, useMemo } from 'react';
import './AdminTimeline.css';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Modal,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import PublishIcon from '@mui/icons-material/Publish';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

const AdminTimeline = ({ authToken }) => {
  // State quản lý tab, dữ liệu, trạng thái loading và lỗi
  const [tab, setTab] = useState(0);
  const [timelineTasks, setTimelineTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  // State quản lý Modal và dữ liệu form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    status: 'NOTSTARTED',
    priority: 'LOW',
    deadline: '',
    // Thêm các trường khác nếu cần
  });

  const startDate = "15/01/2024";
  const endDate = "25/02/2024";
  const ganttDates = ["15/01", "22/01", "29/01", "05/02", "12/02", "19/02", "25/02"];

  // Hàm chung để gọi API
  const callApi = async (url, method, body = null) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };
    const config = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API call failed: ${response.statusText}`);
    }
    return response.json();
  };

  // Hàm fetch danh sách task timeline
  const fetchTimelineTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint: GET /api/admin/timeline-tasks
      const data = await callApi('https://back-end-hk2p.onrender.com/api/admin/timeline-tasks', 'GET');
      setTimelineTasks(data.data);
    } catch (err) {
      console.error("Error fetching timeline tasks:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm fetch dữ liệu phân tích
  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Endpoint: GET /api/timeline/analyze
      const data = await callApi('https://back-end-hk2p.onrender.com/api/timeline/analyze', 'GET');
      setAnalysisData(data.data);
    } catch (err) {
      console.error("Error fetching analysis data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật một task timeline
  const updateTimelineTask = async (taskId, updatedData) => {
    try {
      // Endpoint: PUT /api/admin/timeline-tasks/update/:id
      await callApi(`https://back-end-hk2p.onrender.com/api/admin/timeline-tasks/update/${taskId}`, 'PUT', updatedData);
      alert('Cập nhật task thành công!');
      fetchTimelineTasks(); // Refresh danh sách sau khi cập nhật
    } catch (err) {
      alert(`Lỗi khi cập nhật task: ${err.message}`);
    }
  };

  // Hàm xóa một task timeline
  const deleteTimelineTask = async (taskId) => {
    try {
      if (window.confirm('Bạn có chắc chắn muốn xóa task này?')) {
        // Endpoint: DELETE /api/admin/timeline-tasks/delete/:id
        await callApi(`https://back-end-hk2p.onrender.com/api/admin/timeline-tasks/delete/${taskId}`, 'DELETE');
        alert('Xóa task thành công!');
        fetchTimelineTasks(); // Refresh danh sách sau khi xóa
      }
    } catch (err) {
      alert(`Lỗi khi xóa task: ${err.message}`);
    }
  };

  // Effect hook để gọi API khi component được mount hoặc tab thay đổi
  useEffect(() => {
    if (!authToken) {
      setError('Lỗi xác thực. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }
    
    if (tab === 0) {
      fetchTimelineTasks();
    } else if (tab === 1) {
      fetchAnalysisData();
    }
  }, [authToken, tab]);

  // UseMemo để tính toán các giá trị chỉ khi `timelineTasks` hoặc `analysisData` thay đổi
  const totalTasks = analysisData?.totalTasks || timelineTasks.length;
  const completedTasks = analysisData?.completedTasks || timelineTasks.filter(task => task.status === 'COMPLETE').length;
  const inProgressTasks = analysisData?.inProgressTasks || timelineTasks.filter(task => task.status === 'INPROGRESS').length;
  const averageProgress = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

  const sortedTasks = useMemo(() => {
    return [...timelineTasks].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }, [timelineTasks]);

  // Các hàm tiện ích
  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getStatusDisplay = (status) => {
    let icon = null;
    let color = '';
    let label = '';
    switch (status) {
      case 'COMPLETE':
        icon = <DoneAllIcon fontSize="small" />;
        color = 'success';
        label = 'Hoàn thành';
        break;
      case 'INPROGRESS':
        icon = <HourglassEmptyIcon fontSize="small" />;
        color = 'info';
        label = 'Đang thực hiện';
        break;
      case 'NOTSTARTED':
        icon = <AccessTimeIcon fontSize="small" />;
        color = 'default';
        label = 'Chưa bắt đầu';
        break;
      case 'OVERDUE':
        icon = <HighlightOffIcon fontSize="small" />;
        color = 'error';
        label = 'Quá hạn';
        break;
      case 'SUBMITTED':
        icon = <PublishIcon fontSize="small" />;
        color = 'primary';
        label = 'Đã nộp';
        break;
      case 'NEEDSREVIEW':
        icon = <AssignmentLateIcon fontSize="small" />;
        color = 'warning';
        label = 'Cần xem xét';
        break;
      case 'ONHOLD':
        icon = <PauseCircleFilledIcon fontSize="small" />;
        color = 'secondary';
        label = 'Tạm dừng';
        break;
      default:
        icon = null;
        color = 'default';
        label = status;
    }
    return <Chip label={label} icon={icon} color={color} size="small" />;
  };

  // Hàm xử lý khi mở/đóng modal
  const handleOpenModal = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setFormState({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        deadline: task.deadline ? new Date(task.deadline).toISOString().substring(0, 10) : '',
      });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };

  // Hàm xử lý submit form
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (currentTask) {
      updateTimelineTask(currentTask._id, formState);
    }
    handleCloseModal();
  };

  return (
    <Box className="admin-timeline-root">
      <Box className="tab-container">
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          centered
          TabIndicatorProps={{ style: { display: 'none' } }}
          className="simple-tabs"
        >
          <Tab
            label="Xem Timeline"
            className={tab === 0 ? 'tab-selected' : ''}
          />
          <Tab
            label="Phân tích Timeline"
            className={tab === 1 ? 'tab-selected' : ''}
          />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box className="cards-wrapper">
          <Paper elevation={3} className="custom-card gantt-paper">
            <Box className="gantt-title-row">
              <Typography className="card-title">Biểu Đồ Timeline Gantt</Typography>
            </Box>
            <Divider className="divider" />
            <Box className="gantt-dates">
              {ganttDates.map(date => (
                <Box key={date} className="gantt-date-label">{date}</Box>
              ))}
            </Box>
            {loading && <Typography>Đang tải nhiệm vụ timeline...</Typography>}
            {error && <Typography color="error">Lỗi: {error}</Typography>}
            {!loading && !error && timelineTasks.length === 0 ? (
              <Box className="empty-state gantt-empty">
                <div className="empty-state-icon">📅</div>
                <div className="empty-state-title">Chưa có nhiệm vụ nào</div>
                <Typography className="empty-state-caption">
                  Không có task nào để hiển thị.
                </Typography>
              </Box>
            ) : (
              <Box className="gantt-content">
                <List dense>
                  {sortedTasks.map(task => (
                    <ListItem key={task._id} divider sx={{ justifyContent: 'space-between' }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="body1" fontWeight="bold">
                              {task.title}
                            </Typography>
                            {getStatusDisplay(task.status)}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Mô tả: {task.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Ưu tiên: {task.priority}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Ngày tạo: {formatDate(task.createdAt)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Deadline: {formatDate(task.deadline)}
                            </Typography>
                          </>
                        }
                      />
                      <Box>
                        <Button onClick={() => handleOpenModal(task)} size="small" sx={{ mr: 1 }}>Sửa</Button>
                        <Button onClick={() => deleteTimelineTask(task._id)} size="small" color="error">Xóa</Button>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>

          <Paper elevation={3} className="custom-card calendar-paper">
            <Box className="calendar-title-row">
              <Typography className="card-title">Biểu Đồ Timeline Lịch</Typography>
              <Button size="small" className="calendar-btn">Xem theo tuần</Button>
            </Box>
            <Divider className="divider" />
            {loading && <Typography>Đang tải nhiệm vụ lịch...</Typography>}
            {error && <Typography color="error">Lỗi: {error}</Typography>}
            {!loading && !error && timelineTasks.length === 0 ? (
              <Box className="empty-state calendar-empty">
                <div className="empty-state-icon">⏰</div>
                <div className="empty-state-title">Timeline trống</div>
                <Typography className="empty-state-caption">
                  Không có task nào để hiển thị.
                </Typography>
              </Box>
            ) : (
              <Box className="calendar-content">
                <Typography variant="h6" sx={{ mb: 2 }}>Chế độ xem lịch cho nhiệm vụ:</Typography>
                <List dense>
                  {sortedTasks.map(task => (
                    <ListItem key={task._id} divider>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                            <Typography variant="body1" fontWeight="bold">
                              {task.title}
                            </Typography>
                            {getStatusDisplay(task.status)}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Ngày tạo: {formatDate(task.createdAt)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Mô tả: {task.description}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Box>
      )}

      {tab === 1 && (
        <Paper elevation={3} className="custom-card analysis-paper">
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Tổng nhiệm vụ</Typography>
                <Typography className="stat-value">{totalTasks}</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Hoàn thành</Typography>
                <Typography className="stat-value">
                  {completedTasks} <CheckCircleIcon color="success" />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Đang thực hiện</Typography>
                <Typography className="stat-value">
                  {inProgressTasks} <PlayCircleIcon color="info" />
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box className="analysis-stat-box">
                <Typography className="stat-title">Tiến độ trung bình</Typography>
                <Typography className="stat-value">{averageProgress}%</Typography>
              </Box>
            </Grid>
          </Grid>
          {loading && <Typography>Đang tính toán dữ liệu phân tích...</Typography>}
          {error && <Typography color="error">Lỗi: {error}</Typography>}
          {!loading && !error && totalTasks === 0 ? (
            <Box className="empty-state analysis-empty">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">Chưa có dữ liệu để phân tích</div>
              <Typography className="empty-state-caption">
                Hiện không có task nào để phân tích
              </Typography>
            </Box>
          ) : (
            <Box className="analysis-content">
              <Typography variant="h6">Dữ liệu phân tích:</Typography>
              <p>Tổng nhiệm vụ: {totalTasks}</p>
              <p>Hoàn thành: {completedTasks}</p>
              <p>Đang thực hiện: {inProgressTasks}</p>
              <p>Tiến độ trung bình: {averageProgress}%</p>
            </Box>
          )}
        </Paper>
      )}

      {/* Modal để cập nhật task */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Cập nhật Task
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Tiêu đề"
              value={formState.title}
              onChange={(e) => setFormState({ ...formState, title: e.target.value })}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mô tả"
              multiline
              rows={4}
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formState.status}
                label="Trạng thái"
                onChange={(e) => setFormState({ ...formState, status: e.target.value })}
              >
                <MenuItem value="NOTSTARTED">Chưa bắt đầu</MenuItem>
                <MenuItem value="INPROGRESS">Đang thực hiện</MenuItem>
                <MenuItem value="COMPLETE">Hoàn thành</MenuItem>
                <MenuItem value="OVERDUE">Quá hạn</MenuItem>
                <MenuItem value="SUBMITTED">Đã nộp</MenuItem>
                <MenuItem value="NEEDSREVIEW">Cần xem xét</MenuItem>
                <MenuItem value="ONHOLD">Tạm dừng</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal"
              label="Ngày hết hạn"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formState.deadline}
              onChange={(e) => setFormState({ ...formState, deadline: e.target.value })}
              required
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
              <Button onClick={handleCloseModal} color="secondary">
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Lưu thay đổi
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminTimeline;
