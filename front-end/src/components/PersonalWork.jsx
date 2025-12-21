import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  LinearProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const initialFormState = {
  title: '',
  date: '',
  time: '',
  description: '',
  completed: false,
};

function PersonalWork() {
  const [schedule, setSchedule] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  const openEditDialog = useCallback((entry = null) => {
    setEditingEntry(entry);
    setFormData(entry || { ...initialFormState, id: Date.now() });
    setOpenDialog(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingEntry(null);
    setFormData(initialFormState);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleSaveEntry = useCallback(() => {
    if (!formData.title || !formData.date || !formData.time) {
      showSnackbar('Vui lòng điền đầy đủ các trường bắt buộc (Tiêu đề, Ngày, Giờ).', 'error');
      return;
    }

    setSchedule((prevSchedule) => {
      return editingEntry
        ? prevSchedule.map((entry) => (entry.id === formData.id ? formData : entry))
        : [...prevSchedule, formData];
    });

    showSnackbar(
      editingEntry ? 'Mục lịch trình đã được cập nhật thành công!' : 'Mục lịch trình đã được tạo thành công!',
      'success'
    );
    closeDialog();
  }, [formData, editingEntry, showSnackbar, closeDialog]);

  const handleDeleteEntry = useCallback((idToDelete) => {
    setSchedule((prevSchedule) => prevSchedule.filter((entry) => entry.id !== idToDelete));
    showSnackbar('Mục lịch trình đã được xóa thành công!', 'success');
  }, [showSnackbar]);

  const handleToggleComplete = useCallback((id) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((entry) =>
        entry.id === id ? { ...entry, completed: !entry.completed } : entry
      )
    );
    showSnackbar('Trạng thái hoàn thành đã được cập nhật!', 'info');
  }, [showSnackbar]);

  const completionPercentage = useMemo(() => {
    if (schedule.length === 0) {
      return 0;
    }
    const completedTasks = schedule.filter(entry => entry.completed).length;
    return Math.round((completedTasks / schedule.length) * 100);
  }, [schedule]);

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: 'auto', mt: 4, bgcolor: '#f9f9f9', borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary">
          Lịch làm việc
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => openEditDialog()}>
          Tạo lịch làm việc cá nhân
        </Button>
      </Box>

      {schedule.length > 0 && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Tiến độ hoàn thành: {completionPercentage}%
          </Typography>
          <LinearProgress variant="determinate" value={completionPercentage} sx={{ height: 10, borderRadius: 5 }} />
        </Box>
      )}

      {schedule.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mt: 5 }}>
          Chưa có lịch nào!
        </Typography>
      ) : (
        <List>
          {schedule.map((entry) => (
            <Box
              key={entry.id}
              sx={{
                mb: 2,
                p: 2,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                bgcolor: entry.completed ? '#e8f5e9' : 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 1,
                textDecoration: entry.completed ? 'line-through' : 'none',
                opacity: entry.completed ? 0.7 : 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={entry.completed}
                    onChange={() => handleToggleComplete(entry.id)}
                    color="primary"
                  />
                }
                label={
                  <ListItemText
                    primary={
                      <Typography variant="h6" color="text.primary">
                        {entry.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Ngày: {entry.date} lúc {entry.time}
                        </Typography>
                        {entry.description && (
                          <Typography variant="body2" color="text.secondary">
                            Mô tả: {entry.description}
                          </Typography>
                        )}
                      </>
                    }
                  />
                }
              />
              <Box>
                <IconButton color="primary" onClick={() => openEditDialog(entry)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeleteEntry(entry.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>{editingEntry ? 'Chỉnh Sửa Mục Lịch Trình' : 'Tạo Mục Lịch Trình Mới'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Tiêu đề"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="date"
            name="date"
            label="Ngày"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.date}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="time"
            name="time"
            label="Giờ"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.time}
            onChange={handleInputChange}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Mô tả"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.completed}
                onChange={handleInputChange}
                name="completed"
                color="primary"
              />
            }
            label="Đã hoàn thành"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Hủy</Button>
          <Button onClick={handleSaveEntry} variant="contained">
            {editingEntry ? 'Cập nhật' : 'Tạo'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PersonalWork;