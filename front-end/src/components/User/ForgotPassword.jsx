import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import { toast } from 'react-toastify';
import './ResetPassword.css'; // Reusing the CSS from ResetPassword for styling consistency

const ForgotPassword = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://back-end-hk2p.onrender.com/api/accounts/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Một liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
        setCurrentPage('/login'); // Redirect to login after successful request
      } else {
        toast.error(data.message || 'Yêu cầu đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại email.');
      }
    } catch (err) {
      console.error('Network error or unexpected issue:', err);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 1, }}>
        <Typography component="h1" variant="h5" color="primary">
          Quên Mật Khẩu
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2, mb: 1, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' },}}
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : 'Gửi Yêu Cầu Đặt Lại'}
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

export default ForgotPassword;