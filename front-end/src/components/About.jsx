import { Box, Typography, Button, Container, Grid } from '@mui/material';
import './About.css';

function About() {
  return (
    <>
      {/* Header Section */}
      <Box
        className="header-section"
        sx={{
          minHeight: '70vh',
          background: 'linear-gradient(135deg, #333 0%, #000 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          padding: { xs: 3, md: 6 },
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '3rem', md: '5rem' },
                lineHeight: 1.2,
                marginBottom: 3,
              }}
            >
              Quản lý website chuyên nghiệp
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                marginBottom: 5,
                maxWidth: '800px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              Giải pháp toàn diện cho việc quản lý, tối ưu và bảo mật website của bạn. Đơn giản, hiệu quả và luôn cập nhật tin tức.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#fff',
                  color: '#000',
                  padding: '12px 30px',
                  borderRadius: 25,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': { backgroundColor: '#ccc' },
                }}
              >
                Bắt đầu ngay
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: '#fff',
                  padding: '12px 30px',
                  borderRadius: 25,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  '&:hover': { borderColor: '#ccc', color: '#ccc' },
                }}
              >
                Xem demo
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              right: '10%',
              width: { xs: '250px', md: '400px' },
              height: { xs: '200px', md: '300px' },
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 16,
              zIndex: 0,
            }}
          />
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: '#fff' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ textAlign: 'center', color: '#000', mb: 6, fontWeight: 700 }}
          >
            Tính năng nổi bật
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {/* Row 1 */}
            <Grid item xs={12} sm={4} md={4}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                  height: 250,
                  width: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Tối ưu hóa tốc độ
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Tối ưu website với các công cụ hiện đại.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                  height: 250,
                  width: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Bảo mật cao
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Bảo vệ 24/7 với firewall và monitoring.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                  height: 250,
                  width: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Phân tích chuyên sâu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Báo cáo traffic và hiệu suất chi tiết.
                </Typography>
              </Box>
            </Grid>
            {/* Row 2 */}
            <Grid item xs={12} sm={4} md={4}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                  height: 250,
                  width: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  SEO tối ưu
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Tăng thứ hạng trên các công cụ tìm kiếm.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                  height: 250,
                  width: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Responsive Design
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Website hoạt động tốt trên mọi thiết bị.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#f5f5f5',
                  height: 250,
                  width: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: '#000',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                    }}
                  />
                </Box>
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Hỗ trợ 24/7
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', wordBreak: 'break-word', maxWidth: '90%' }}>
                  Hỗ trợ nhanh chóng mọi lúc mọi nơi.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Quy trình làm việc Section */}
      <Box sx={{ py: 8, backgroundColor: '#e0e0e0' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ textAlign: 'center', color: '#000', mb: 6, fontWeight: 700 }}
          >
            Quy trình làm việc
          </Typography>
          <Grid container spacing={6} justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={2.8} md={2.8}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 200,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem' }}>
                  Bước 1: Tư vấn
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', maxWidth: '80%' }}>
                  Hiểu nhu cầu và đề xuất giải pháp.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={2.8} md={2.8}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 200,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem' }}>
                  Bước 2: Thiết kế
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', maxWidth: '80%' }}>
                  Tạo giao diện và cấu trúc website.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={2.8} md={2.8}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 200,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem' }}>
                  Bước 3: Phát triển
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', maxWidth: '80%' }}>
                  Xây dựng và tích hợp chức năng.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={2.8} md={2.8}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 200,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem' }}>
                  Bước 4: Bàn giao
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', maxWidth: '80%' }}>
                  Kiểm tra và giao website hoàn chỉnh.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Giá trị cốt lõi Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ textAlign: 'center', color: '#000', mb: 6, fontWeight: 700 }}
          >
            Giá trị cốt lõi
          </Typography>
          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            <Grid item xs={12} sm={3} md={3}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 200,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem' }}>
                  Chất lượng
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', maxWidth: '80%' }}>
                  Cam kết sản phẩm hoàn hảo.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 200,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem' }}>
                  Uy tín
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', maxWidth: '80%' }}>
                  Xây dựng niềm tin với khách hàng.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 200,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem' }}>
                  Sáng tạo
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', maxWidth: '80%' }}>
                  Đưa ra giải pháp độc đáo.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <Box
                className="feature-card"
                sx={{
                  textAlign: 'center',
                  borderRadius: 8,
                  backgroundColor: '#fff',
                  height: 200,
                  width: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                <Typography variant="h6" sx={{ color: '#000', mb: 1, fontSize: '1.1rem' }}>
                  Hỗ trợ
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', fontSize: '0.95rem', maxWidth: '80%' }}>
                  Dịch vụ tận tâm 24/7.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Liên hệ Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #444 0%, #111 100%)',
          color: '#fff',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{ textAlign: 'center', mb: 6, fontWeight: 700 }}
          >
            Liên hệ với chúng tôi
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.2rem' }}>
              Bạn cần hỗ trợ? Hãy liên hệ ngay hôm nay!
            </Typography>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#fff',
                color: '#000',
                padding: '12px 30px',
                borderRadius: 25,
                textTransform: 'none',
                fontSize: '1.1rem',
                '&:hover': { backgroundColor: '#ccc' },
              }}
            >
              Gửi yêu cầu
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default About;