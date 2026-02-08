// Login.jsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import './Login.css';
import { toast } from 'react-toastify'; // Import toast
import axiosClient from '../../api/axiosClient';

const Login = ({ setCurrentPage, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const data = await axiosClient.post('/accounts/login', {
        email,
        password,
      });

      console.log('Login successful:', data);
      console.log('Token received for login success:', data.token);
      toast.success("Đăng nhập thành công!"); // Toast for successful login
      setCurrentPage('/homepage'); // Redirect to homepage immediately after login
      onLoginSuccess(data.token); // Pass token to App.jsx for further processing (e.g., fetching profile)
    } catch (err) {
      console.error('Login failed:', err);
      const message = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.';
      toast.error(message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#f9f9f9',
          p: 4,
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <Typography component="h1" variant="h5" color="primary">
          Đăng Nhập
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth id="password" label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' }, }}>
            Đăng Nhập
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>

            <Link
              href="/reset-password"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage('/forgot-password');
              }}
              sx={{ color: '#4a90e2', textDecoration: 'none' }}
            >
              {"Quên mật khẩu?"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;