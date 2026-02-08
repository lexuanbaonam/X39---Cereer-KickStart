import React, { useState, useEffect } from 'react';
import {
  CircularProgress,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Chip,
  Grid,
  styled,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import { toast } from 'react-toastify';
import axiosClient from '../api/axiosClient';

// Styled components
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
  '&:hover': {
    background: 'white',
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)',
  },
});

const RequestCard = styled(Paper)({
  margin: '16px 0',
  borderRadius: '16px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
  },
});

const DialogButton = styled(Button)(({ variant }) => ({
  textTransform: 'none',
  fontWeight: 600,
  borderRadius: '8px',
  ...(variant === 'delete' && {
    color: 'white',
    background: 'linear-gradient(45deg, #ff6b6b 30%, #ff4757 90%)',
    '&:hover': {
      background: 'linear-gradient(45deg, #ff4757 30%, #ff6b6b 90%)',
    },
  }),
}));

const getStatusColor = (status) => {
  switch (status) {
    case 'Chờ xử lý':
      return { backgroundColor: '#ffc107', color: '#000' };
    case 'Đang xử lý':
      return { backgroundColor: '#17a2b8', color: '#fff' };
    case 'Đã hoàn tất':
      return { backgroundColor: '#28a745', color: '#fff' };
    case 'Đã hủy':
      return { backgroundColor: '#dc3545', color: '#fff' };
    default:
      return { backgroundColor: '#6c757d', color: '#fff' };
  }
};

const SupportRequestPage = ({ authToken }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [newRequest, setNewRequest] = useState({ title: '', description: '' });
  const [requestToDelete, setRequestToDelete] = useState(null);

  // Fetch support requests & enrich with user info
  const fetchRequests = async () => {
    if (!authToken) {
      console.error('Lỗi: Thiếu authToken để gọi API.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await axiosClient.get('/supports/my-requests');

      const enriched = await Promise.all(
        data.map(async (req) => {
          try {
            const userData = await axiosClient.get(`/users/${req.user}`).then(res => res.user);

            return {
              ...req,
              userInfo: {
                name: userData.name,
                email: userData.personalEmail || userData.companyEmail || '',
                role: userData.roleTag,
                position: userData.jobPosition?.[0]?.title || '',
              },
            };
          } catch (error) {
            console.error(`Lỗi lấy thông tin người dùng: ${error.message}`);
            return { ...req, userInfo: { name: 'Unknown', email: '', role: '', position: '' } };
          }
        })
      );

      setRequests(enriched);
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        toast.error('Bạn không được phép truy cập. Vui lòng kiểm tra lại token.');
      } else if (status === 403) {
        toast.error('Bạn không có quyền truy cập chức năng này.');
      } else {
        toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [authToken]);

  const handleCreateRequest = async () => {
    if (!authToken) {
      return toast.error('Không có token xác thực. Vui lòng đăng nhập.');
    }
    try {
      // BƯỚC 1: Gửi yêu cầu hỗ trợ
      await axiosClient.post('/supports/create', newRequest);

      // BƯỚC 2: Tự động tạo phản hồi sau khi yêu cầu được tạo thành công
      // Dựa trên model, chúng ta cần title và description cho response.
      const responsePayload = {
        title: newRequest.title,
        description: newRequest.description,
        responseMessage: 'Yêu cầu của bạn đã được tiếp nhận và đang chờ xử lý.', // Tin nhắn phản hồi mặc định
      };

      try {
        await axiosClient.post('/supports-response/', responsePayload);
      } catch (err) {
        // Log lỗi nhưng không chặn luồng, vì yêu cầu chính đã thành công.
        console.error('Lỗi khi tự động tạo phản hồi:', err);
      }

      toast.success('Gửi yêu cầu hỗ trợ thành công! Một phản hồi mặc định đã được tạo.');
      setOpenCreateDialog(false);
      setNewRequest({ title: '', description: '' });
      fetchRequests(); // Tải lại danh sách để thấy yêu cầu mới
    } catch (error) {
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteRequest = async () => {
    if (!authToken || !requestToDelete) return toast.error('Không có token xác thực hoặc yêu cầu để xóa.');
    try {
      await axiosClient.delete(`/supports/delete/${requestToDelete._id}`);
      toast.success('Xóa yêu cầu hỗ trợ thành công!');
      setOpenDeleteDialog(false);
      setRequestToDelete(null);
      fetchRequests();
    } catch (error) {
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Root>
      <MainContainer>
        <Header>
          <HeaderTitle>Yêu Cầu Hỗ Trợ</HeaderTitle>
          <HeaderSubtitle>Quản lý và theo dõi các yêu cầu hỗ trợ của bạn</HeaderSubtitle>
        </Header>

        <ContentContainer>
          <ActionBar>
            <Typography variant="h5" component="h2" fontWeight={600} color="primary">
              Danh sách Yêu cầu
            </Typography>
            <CreateButton startIcon={<AddIcon />} onClick={() => setOpenCreateDialog(true)}>
              Gửi Yêu Cầu Mới
            </CreateButton>
          </ActionBar>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : requests.length > 0 ? (
            <List>
              {requests.map((request) => (
                <RequestCard key={request._id}>
                  <ListItem
                    sx={{ flexDirection: 'column', alignItems: 'flex-start', padding: '16px 24px' }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {request.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {request.userInfo.name} — {request.userInfo.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Chức vụ: {request.userInfo.position} | Vai trò: {request.userInfo.role}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {request.description}
                    </Typography>
                    <Grid container alignItems="center" spacing={2} sx={{ mt: 2, width: 'auto' }}>
                      <Grid item>
                        <Chip
                          label={request.status}
                          sx={{ ...getStatusColor(request.status), fontWeight: 600, padding: '4px 8px', borderRadius: '8px' }}
                        />
                      </Grid>
                      <Grid item>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => { setRequestToDelete(request); setOpenDeleteDialog(true); }}
                          sx={{ color: '#ff4757', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                </RequestCard>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
              <Typography variant="h6">Bạn chưa có yêu cầu hỗ trợ nào.</Typography>
            </Box>
          )}
        </ContentContainer>
      </MainContainer>

      {/* Dialog để tạo yêu cầu mới */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Gửi Yêu Cầu Hỗ Trợ Mới</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Tiêu đề"
            fullWidth
            variant="outlined"
            value={newRequest.title}
            onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline rows={4}
            variant="outlined"
            value={newRequest.description}
            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={() => setOpenCreateDialog(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Hủy
          </Button>
          <Button onClick={handleCreateRequest} color="primary" variant="contained" sx={{ textTransform: 'none', fontWeight: 600 }} disabled={!newRequest.title || !newRequest.description}>
            Gửi Yêu Cầu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog để xác nhận xóa */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa yêu cầu hỗ trợ{' '}
            <Typography component="span" sx={{ fontWeight: 700, background: 'linear-gradient(45deg, #667eea, #764ba2)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              "{requestToDelete?.title}"
            </Typography>
            {' '}không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={() => setOpenDeleteDialog(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
            Hủy
          </Button>
          <DialogButton variant="delete" onClick={handleDeleteRequest} autoFocus>
            Xóa Yêu Cầu
          </DialogButton>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default SupportRequestPage;
