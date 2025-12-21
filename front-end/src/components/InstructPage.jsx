import React from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    styled,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Tạo một số styled components để tùy chỉnh giao diện
const Root = styled(Box)({
    minHeight: '100vh',
    background: '#f0f2f5',
    padding: '48px 0',
});

const Header = styled(Box)({
    textAlign: 'center',
    marginBottom: '48px',
});

const Title = styled(Typography)({
    fontSize: '3rem',
    fontWeight: 700,
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
});

const Subtitle = styled(Typography)({
    color: '#6c757d',
    fontSize: '1.2rem',
    marginTop: '16px',
});

const Section = styled(Box)({
    marginBottom: '48px',
});

const SectionTitle = styled(Typography)({
    fontSize: '2rem',
    fontWeight: 600,
    marginBottom: '24px',
    borderLeft: '4px solid #667eea',
    paddingLeft: '16px',
    color: '#343a40',
});

const StepCard = styled(Card)({
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
    },
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
});

const StepContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexGrow: 1,
});

const InstructPage = ({ setCurrentPage }) => {
    const handleRedirect = (path) => {
        setCurrentPage(path);
    };

    return (
        <Root>
            <Container maxWidth="md">
                <Header>
                    <Title>Hướng Dẫn Sử Dụng</Title>
                    <Subtitle>
                        Chào mừng bạn đến với trang hướng dẫn. Tại đây, bạn sẽ tìm thấy các bước chi tiết để sử dụng hệ thống của chúng tôi một cách hiệu quả.
                    </Subtitle>
                </Header>

                <Section>
                    <SectionTitle>Tổng quan về cách hoạt động</SectionTitle>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <StepCard>
                                <StepContent>
                                    <Box>
                                        <PublicIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Trang Công khai
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Các trang này có thể truy cập mà không cần đăng nhập. Bao gồm: Đăng nhập, Đăng ký, Giới thiệu, và các trang khác mà hệ thống cho phép công khai.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Chip label="/login" color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />
                                        <Chip label="/about" color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />
                                        <Chip label="/timeline" color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />
                                    </Box>
                                </StepContent>
                            </StepCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StepCard>
                                <StepContent>
                                    <Box>
                                        <LockIcon color="secondary" sx={{ fontSize: 40, mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Trang Bảo mật
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Các trang này yêu cầu người dùng phải đăng nhập. Hệ thống sẽ kiểm tra token xác thực của bạn để cấp quyền truy cập. Nếu bạn cố gắng truy cập một trang bảo mật mà chưa đăng nhập, bạn sẽ được chuyển hướng đến trang đăng nhập.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Chip label="/homepage" color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />
                                        <Chip label="/sprints" color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />
                                        <Chip label="/profile" color="secondary" size="small" sx={{ mr: 1, mb: 1 }} />
                                    </Box>
                                </StepContent>
                            </StepCard>
                        </Grid>
                    </Grid>
                </Section>

                <Section>
                    <SectionTitle>Luồng hoạt động</SectionTitle>
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <StepCard>
                                <StepContent>
                                    <Box>
                                        <HowToRegIcon color="primary" sx={{ fontSize: 40, mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Đăng nhập và Xác thực
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Sau khi đăng nhập thành công, bạn sẽ nhận được một token xác thực. Hệ thống sẽ sử dụng token này để tự động tải thông tin hồ sơ người dùng và thông tin tài khoản.
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleRedirect('/login')}
                                        sx={{
                                            marginTop: '16px',
                                            background: '#667eea',
                                            '&:hover': { background: '#5468b3' },
                                        }}
                                    >
                                        Đến trang Đăng nhập
                                    </Button>
                                </StepContent>
                            </StepCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <StepCard>
                                <StepContent>
                                    <Box>
                                        <AdminPanelSettingsIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            Vai trò Quản trị viên
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Một số trang như `/admin`, `/admin-report`, `/admin-timeline`, và `/admin-decentralization` chỉ dành cho người dùng có vai trò là `ADMIN`. Nếu không có quyền, bạn sẽ không thể truy cập các trang này.
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleRedirect('/admin')}
                                        sx={{
                                            marginTop: '16px',
                                            background: '#dc3545',
                                            '&:hover': { background: '#c82333' },
                                        }}
                                    >
                                        Đến trang Quản trị
                                    </Button>
                                </StepContent>
                            </StepCard>
                        </Grid>
                    </Grid>
                </Section>

                <Box sx={{ textAlign: 'center', marginTop: '48px' }}>
                    <Button
                        variant="contained"
                        onClick={() => handleRedirect('/homepage')}
                        sx={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            borderRadius: '50px',
                            padding: '12px 36px',
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
                        }}
                        endIcon={<ArrowForwardIcon />}
                    >
                        Bắt Đầu Ngay
                    </Button>
                </Box>
            </Container>
        </Root>
    );
};

export default InstructPage;
