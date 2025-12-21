import React from "react";
import { Box, Typography, Button, Paper, styled } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const Root = styled(Box)({
  minHeight: "100vh",
  background: "white",
  padding: "24px",
});

const MainContainer = styled(Paper)({
  maxWidth: "800px",
  margin: "0 auto",
  borderRadius: "24px",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  overflow: "hidden",
});

const Header = styled(Box)({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "48px 32px",
  textAlign: "center",
  color: "white",
});

const HeaderTitle = styled(Typography)({
  fontSize: "3rem",
  fontWeight: 700,
  marginBottom: "16px",
  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
});

const HeaderSubtitle = styled(Typography)({
  fontSize: "1.2rem",
  opacity: 0.9,
});

const ContentContainer = styled(Box)({
  padding: "32px",
  textAlign: "center",
});

export default function NotFoundPage({ setCurrentPage, homePath }) {
  return (
    <Root>
      <MainContainer elevation={0}>
        <Header>
          <HeaderTitle>404</HeaderTitle>
          <HeaderSubtitle>Trang bạn tìm kiếm không tồn tại</HeaderSubtitle>
        </Header>
        <ContentContainer>
          <Typography
            variant="body1"
            sx={{ color: "#6c757d", mb: 4, fontSize: "1.1rem" }}
          >
            Có thể đường dẫn đã bị đổi tên, xóa hoặc bạn gõ sai URL.
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => setCurrentPage(homePath)}
            sx={{
              borderRadius: "12px",
              padding: "12px 32px",
              fontSize: "1.1rem",
              fontWeight: 600,
              textTransform: "none",
              background: "white",
              boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
              transition: "all 0.3s ease",
              color: "#667eea",
              ":hover": {
                background: "white",
                boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Quay về trang chủ
          </Button>
        </ContentContainer>
      </MainContainer>
    </Root>
  );
}
