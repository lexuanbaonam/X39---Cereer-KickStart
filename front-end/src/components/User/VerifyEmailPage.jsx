
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import { toast } from 'react-toastify';

const VerifyEmailPage = ({ token, setCurrentPage, onVerificationSuccess }) => {
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error('Không tìm thấy token xác thực.');
      setTimeout(() => setCurrentPage('/login'), 2000);
      return;
    }

    const verifyAccountAndCreateProfile = async () => {
      setIsVerifying(true);
      try {
        console.log('VerifyEmailPage: Using token in verification URL.',token);
        const verificationResponse = await fetch(`https://back-end-hk2p.onrender.com/api/accounts/verify-email/${token}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const verificationData = await verificationResponse.json();

        if (verificationResponse.ok) {
          toast.success(verificationData.message || 'Xác thực tài khoản thành công!');

          const authToken = verificationData.token;
          if (authToken) {
            console.log('VerifyEmailPage: Auth token received after verification.');
            onVerificationSuccess(authToken, verificationData.account);
          } else {
            toast.info('Xác thực thành công. Vui lòng đăng nhập.');
            setTimeout(() => setCurrentPage('/login'), 3000);
          }
        } else {
          toast.error(verificationData.message || 'Xác thực tài khoản thất bại.');
          setTimeout(() => setCurrentPage('/login'), 3000);
        }
      } catch (error) {
        console.error('Lỗi xác thực email:', error);
        toast.error('Đã xảy ra lỗi khi xác thực email. Vui lòng thử lại.');
        setTimeout(() => setCurrentPage('/login'), 3000);
      } finally {
        setIsVerifying(false); // Stop verifying
      }
    };

    // Thêm độ trễ 2 giây trước khi gọi verifyAccountAndCreateProfile
    const timer = setTimeout(() => {
      verifyAccountAndCreateProfile();
    }, 2000); // 2000 milliseconds = 2 seconds

    // Dọn dẹp timer khi component unmount hoặc khi dependencies thay đổi
    return () => clearTimeout(timer);

  }, [token, setCurrentPage, onVerificationSuccess]);

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: '#f9f9f9', p: 3, borderRadius: 2, boxShadow: 1 }}>
        <Typography component="h1" variant="h5" color="primary" sx={{ mb: 2 }}>
          Xác thực Email
        </Typography>
        {isVerifying ? (
          <CircularProgress sx={{ mb: 2 }} />
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
            Quá trình xác thực đã hoàn tất.
          </Typography>
        )}
        {!isVerifying && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Bạn có thể{' '}
            <span
              style={{ cursor: 'pointer', color: '#4a90e2', textDecoration: 'underline' }}
              onClick={() => setCurrentPage('/login')}
            >
              đăng nhập
            </span>{' '}

            nếu cần.
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default VerifyEmailPage;