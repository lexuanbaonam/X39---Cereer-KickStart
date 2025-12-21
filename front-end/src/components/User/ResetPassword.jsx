import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import { toast } from 'react-toastify';
import './ResetPassword.css';

const ResetPassword = ({ setCurrentPage }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState(''); // State to store the token

  useEffect(() => {
    // Extract token from URL when component mounts
    const pathParts = window.location.pathname.split('/');
    const extractedToken = pathParts[pathParts.length - 1]; // Get the last part of the path
    setToken(extractedToken);
    console.log("Extracted token from URL:", extractedToken);

    if (!extractedToken || extractedToken === 'reset-password') {
      toast.error('Liên kết đặt lại mật khẩu không hợp lệ hoặc bị thiếu.');
      // Optional: Redirect to forgot-password if token is missing/invalid
      // setCurrentPage('/forgot-password');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    if (!token) {
      toast.error('Không tìm thấy token đặt lại mật khẩu. Vui lòng yêu cầu lại.');
      return;
    }

    try {
      const response = await fetch(`https://back-end-hk2p.onrender.com/api/accounts/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword,
          confirmPassword: confirmNewPassword
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Mật khẩu của bạn đã được đặt lại thành công!');
        setCurrentPage('/login'); // Redirect to login after successful reset
      } else {
        toast.error(data.message || 'Đặt lại mật khẩu thất bại. Liên kết có thể không hợp lệ hoặc đã hết hạn.');
      }
    } catch (err) {
      console.error('Network error or unexpected issue:', err);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 1, }}>
        <Typography component="h1" variant="h5" color="primary">
          Đặt Lại Mật Khẩu
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Mật khẩu mới"
            type="password"
            id="newPassword"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmNewPassword"
            label="Xác nhận mật khẩu mới"
            type="password"
            id="confirmNewPassword"
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          {message && (
            <Typography color="success" variant="body2" sx={{ mt: 1 }}>
              {message}
            </Typography>
          )}
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' },}}>
            Đặt Lại Mật Khẩu
          </Button>
          <Link href="/login" onClick={(e) => {
            e.preventDefault();
            setCurrentPage('/login');
          }}
          sx={{ color: '#4a90e2', textDecoration: 'none', }}>
            {"Quay lại Đăng nhập"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;