// CreateTask.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  useTheme,
  Grid,
  Chip,
} from '@mui/material';
import { 
  Save as SaveIcon, 
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'https://back-end-hk2p.onrender.com/api';

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Thấp', color: '#4caf50' },
  { value: 'MEDIUM', label: 'Trung bình', color: '#ff9800' },
  { value: 'HIGH', label: 'Cao', color: '#f44336' },
];

function CreateTask({ authToken, currentUser, setCurrentPage }) {
  // Add loading state for user profile
  const [userLoading, setUserLoading] = useState(!currentUser);

  useEffect(() => {
    if (currentUser) {
      setUserLoading(false);
    } else if (authToken) {
      // Give some time for parent component to load user profile
      const timer = setTimeout(() => {
        setUserLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, authToken]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sprint: '',
    priority: 'MEDIUM',
  });
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sprintsLoading, setSprintsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error',
  });

  const theme = useTheme();

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Fetch sprints for selection
  const fetchSprints = useCallback(async () => {
    if (!authToken) {
      showSnackbar('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.', 'error');
      setSprintsLoading(false);
      return;
    }

    setSprintsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/sprint/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setSprints(response.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách sprint:', err);
      showSnackbar('Lỗi khi tải danh sách sprint. Vui lòng thử lại.', 'error');
    } finally {
      setSprintsLoading(false);
    }
  }, [authToken, showSnackbar]);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả là bắt buộc';
    }

    if (!formData.sprint) {
      newErrors.sprint = 'Vui lòng chọn sprint';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) {
      showSnackbar('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sprint: formData.sprint,
        priority: formData.priority,
      };

      const response = await axios.post(`${API_BASE_URL}/task`, taskData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.data) {
        showSnackbar('Tạo công việc mới thành công!', 'success');
        // Reset form
        setFormData({
          title: '',
          description: '',
          sprint: '',
          priority: 'MEDIUM',
        });
        
        // Redirect to tasks page or sprints page after a short delay
        setTimeout(() => {
          setCurrentPage('/sprints');
        }, 1500);
      }
    } catch (error) {
      console.error('Lỗi khi tạo task:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi tạo công việc. Vui lòng thử lại.';
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    setCurrentPage('/sprints');
  };

  const getPriorityColor = (priority) => {
    const option = PRIORITY_OPTIONS.find(opt => opt.value === priority);
    return option ? option.color : theme.palette.primary.main;
  };

  const getPriorityLabel = (priority) => {
    const option = PRIORITY_OPTIONS.find(opt => opt.value === priority);
    return option ? option.label : priority;
  };

  // Show loading if waiting for user profile or sprints
  if (userLoading || sprintsLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2, color: theme.palette.text.secondary }}>
          {userLoading ? 'Đang tải thông tin người dùng...' : 'Đang tải danh sách Sprint...'}
        </Typography>
      </Box>
    );
  }

  // If no current user after loading, show error
  if (!currentUser) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '80vh' 
      }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Không thể tải thông tin người dùng
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => setCurrentPage('/profile')}
        >
          Quay lại Profile
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 2, sm: 3 },
      maxWidth: 800,
      margin: 'auto',
      mt: { xs: 2, sm: 3 },
    }}>
      <Paper elevation={3} sx={{ 
        p: { xs: 2, sm: 3 }, 
        borderRadius: 2,
        bgcolor: theme.palette.background.paper 
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mr: 2 }}
          >
            Quay lại
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <AssignmentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              Tạo Công Việc Mới
            </Typography>
          </Box>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="title"
                label="Tiêu đề công việc"
                value={formData.title}
                onChange={handleInputChange}
                error={!!errors.title}
                helperText={errors.title}
                required
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Mô tả chi tiết"
                value={formData.description}
                onChange={handleInputChange}
                error={!!errors.description}
                helperText={errors.description}
                required
                multiline
                rows={4}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </Grid>

            {/* Sprint Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.sprint} required>
                <InputLabel>Sprint</InputLabel>
                <Select
                  name="sprint"
                  value={formData.sprint}
                  onChange={handleInputChange}
                  label="Sprint"
                >
                  {sprints.length === 0 ? (
                    <MenuItem disabled>
                      <Typography color="text.secondary">
                        Không có sprint nào
                      </Typography>
                    </MenuItem>
                  ) : (
                    sprints.map((sprint) => (
                      <MenuItem key={sprint._id} value={sprint._id}>
                        <Box>
                          <Typography variant="body1">
                            {sprint.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(sprint.startDate).toLocaleDateString()} - {new Date(sprint.endDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.sprint && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                    {errors.sprint}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Priority Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Độ ưu tiên</InputLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  label="Độ ưu tiên"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                          label={option.label}
                          size="small"
                          sx={{
                            bgcolor: option.color,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Selected Sprint Preview */}
            {formData.sprint && (
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: theme.palette.grey[50], 
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.divider}`
                }}>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
                    Sprint được chọn:
                  </Typography>
                  {(() => {
                    const selectedSprint = sprints.find(s => s._id === formData.sprint);
                    return selectedSprint ? (
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {selectedSprint.title}
                        </Typography>
                        {selectedSprint.describe && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {selectedSprint.describe}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Thời gian: {new Date(selectedSprint.startDate).toLocaleDateString()} - {new Date(selectedSprint.endDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ) : null;
                  })()}
                </Box>
              </Grid>
            )}

            {/* Priority Preview */}
            <Grid item xs={12}>
              <Box sx={{ 
                p: 2, 
                bgcolor: theme.palette.grey[50], 
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography variant="subtitle2" color="primary" sx={{ mr: 2 }}>
                  Độ ưu tiên:
                </Typography>
                <Chip
                  label={getPriorityLabel(formData.priority)}
                  sx={{
                    bgcolor: getPriorityColor(formData.priority),
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleGoBack}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading || sprints.length === 0}
                  sx={{
                    minWidth: 140,
                    bgcolor: theme.palette.success.main,
                    '&:hover': {
                      bgcolor: theme.palette.success.dark,
                    },
                  }}
                >
                  {loading ? 'Đang tạo...' : 'Tạo Công Việc'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CreateTask;