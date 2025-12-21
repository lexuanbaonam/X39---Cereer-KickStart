// Register.jsx
import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Link } from '@mui/material';
import './Register.css';
import { toast } from 'react-toastify'; // Import toast

const Register = ({ setCurrentPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  // const [error, setError] = useState(''); // Remove error state
  // const [successMessage, setSuccessMessage] = useState(''); // Remove successMessage state

  const handleSubmit = async (event) => {
    event.preventDefault();
    // setError(''); // Remove setError
    // setSuccessMessage(''); // Remove setSuccessMessage

    if (password !== confirmPassword) {
      toast.error('Mật khẩu và xác nhận mật khẩu không khớp.'); // Use toast.error
      return;
    }

    try {
      // Step 1: Register the account
      const registerResponse = await fetch('https://back-end-hk2p.onrender.com/api/accounts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          name,
          age: parseInt(age),
          phone,
        }),
      });

      const registerData = await registerResponse.json();

      if (registerResponse.ok) {
        console.log('Registration successful:', registerData);
        toast.success(registerData.message || 'Đăng ký thành công!'); // Use toast.success

        // Step 2: If registration is successful, send verification email
        if (registerData.account && registerData.account.email) {
          try {
            const verifyEmailResponse = await fetch('https://back-end-hk2p.onrender.com/api/accounts/send-verification', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: registerData.account.email }),
            });

            const verifyEmailData = await verifyEmailResponse.json();

            if (verifyEmailResponse.ok) {
              console.log('Verification email sent successfully:', verifyEmailData);
              toast.success('Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác thực tài khoản.'); // Use toast.success
            } else {
              console.error('Failed to send verification email:', verifyEmailData);
              toast.error(verifyEmailData.message || 'Đăng ký thành công nhưng không gửi được email xác thực. Vui lòng thử lại sau.'); // Use toast.error
            }
          } catch (verifyEmailError) {
            console.error('Network error or unexpected issue when sending verification email:', verifyEmailError);
            toast.error('Đăng ký thành công nhưng gặp lỗi khi gửi email xác thực. Vui lòng thử lại sau.'); // Use toast.error
          }
        }
      } else {
        console.error('Registration failed:', registerData);
        toast.error(registerData.message || 'Đăng ký thất bại. Vui lòng thử lại.'); // Use toast.error
      }
    } catch (err) {
      console.error('Network error or unexpected issue:', err);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại sau.'); // Use toast.error
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
          Đăng Ký
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="email" label="Email" name="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" required fullWidth id="name" label="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
          
          <TextField margin="normal" required fullWidth id="phone" label="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextField margin="normal" required fullWidth id="password" label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <TextField margin="normal" required fullWidth id="confirmPassword" label="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          {/* Remove Typography error and success message displays
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
              {successMessage}
            </Typography>
          )}
          */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, mb: 1, bgcolor: '#4a90e2', '&:hover': { bgcolor: '#357abd' },}}>
            Đăng Ký
          </Button>
          <Link href="/login" onClick={(e) => {
            e.preventDefault();
            setCurrentPage('/login');}}
            sx={{ color: '#4a90e2', textDecoration: 'none' }}
          >
            {"Đã có tài khoản? Đăng nhập"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;