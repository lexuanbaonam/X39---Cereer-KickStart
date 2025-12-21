import React, { useState, useEffect } from "react";
import {
  CircularProgress,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  styled,
} from "@mui/material";
import ConstructionIcon from "@mui/icons-material/Construction";
import { toast } from "react-toastify";

// Styled components based on SprintsPage.jsx
const Root = styled(Box)({
  minHeight: "100vh",
  background: "white",
  padding: "24px",
});

const MainContainer = styled(Paper)({
  maxWidth: "1000px",
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
  fontSize: "2.5rem",
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
});

const ActionBar = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "32px",
  gap: "16px",
});

const ResponseCard = styled(Paper)({
  margin: "16px 0",
  borderRadius: "16px",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: "1px solid rgba(102, 126, 234, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
  },
});

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return { backgroundColor: "#ffc107", color: "#000" };
    case "in_progress":
      return { backgroundColor: "#17a2b8", color: "#fff" };
    case "done":
      return { backgroundColor: "#28a745", color: "#fff" };
    default:
      return { backgroundColor: "#6c757d", color: "#fff" };
  }
};

// Chuyển đổi trạng thái từ enum sang tiếng Việt để hiển thị
const getStatusLabel = (status) => {
  switch (status) {
    case "pending":
      return "Chờ xử lý";
    case "in_progress":
      return "Đang xử lý";
    case "done":
      return "Đã hoàn tất";
    default:
      return "Không xác định";
  }
};

const SupportResponsePage = ({ authToken, currentUserId }) => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openHandleDialog, setOpenHandleDialog] = useState(false);
  const [responseToHandle, setResponseToHandle] = useState(null);
  const [handleData, setHandleData] = useState({
    status: "in_progress",
    responseMessage: "",
  });

  // Fetch all support responses (Admin/Leader)
  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://back-end-hk2p.onrender.com/api/supports-response", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!res.ok) throw new Error("Không thể tải dữ liệu yêu cầu hỗ trợ.");
      const data = await res.json();

      // Enrich with user info
      const enriched = await Promise.all(
        data.map(async (resp) => {
          try {
            const userRes = await fetch(
              `https://back-end-hk2p.onrender.com/api/users/${resp.createdBy}`,
              { headers: { Authorization: `Bearer ${authToken}` } }
            );
            if (!userRes.ok)
              throw new Error("Không lấy được thông tin người dùng.");
            const { user } = await userRes.json();
            return { ...resp, userInfo: user };
          } catch {
            return { ...resp, userInfo: null };
          }
        })
      );

      setResponses(enriched);
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) fetchResponses();
  }, [authToken]);

  const handleSupportResponse = async () => {
    try {
      // Dữ liệu cập nhật bao gồm handledBy và handledAt
      const updateData = {
        ...handleData,
        handledBy: currentUserId,
        handledAt: new Date(),
      };
      
      const res = await fetch(
        `https://back-end-hk2p.onrender.com/api/supports-response/${responseToHandle._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(updateData),
        }
      );
      if (!res.ok) throw new Error("Xử lý yêu cầu thất bại.");
      toast.success("Xử lý yêu cầu hỗ trợ thành công!");
      setOpenHandleDialog(false);
      setResponseToHandle(null);
      setHandleData({ status: "in_progress", responseMessage: "" });
      fetchResponses();
    } catch (error) {
      toast.error(`Lỗi: ${error.message}`);
    }
  };

  const openDialog = (resp) => {
    setResponseToHandle(resp);
    setHandleData({
      status: resp.status,
      responseMessage: resp.responseMessage || "",
    });
    setOpenHandleDialog(true);
  };

  return (
    <Root>
      <MainContainer>
        <Header>
          <HeaderTitle>Quản Lý Yêu Cầu Hỗ Trợ</HeaderTitle>
          <HeaderSubtitle>
            Xem và xử lý các yêu cầu hỗ trợ từ người dùng
          </HeaderSubtitle>
        </Header>

        <ContentContainer>
          <ActionBar>
            <Typography
              variant="h5"
              component="h2"
              fontWeight={600}
              color="primary"
            >
              Danh sách Yêu cầu
            </Typography>
          </ActionBar>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : responses.length ? (
            <List>
              {responses.map((resp) => (
                <ResponseCard key={resp._id}>
                  <ListItem
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "16px 24px",
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {resp.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Mô tả: {resp.description}
                    </Typography>
                    {resp.responseMessage && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Phản hồi: {resp.responseMessage}
                      </Typography>
                    )}
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="flex-end"
                      spacing={2}
                      sx={{ mt: 2, width: "auto" }}
                    >
                      <Grid item>
                        <Chip
                          label={getStatusLabel(resp.status)}
                          sx={{
                            ...getStatusColor(resp.status),
                            fontWeight: 600,
                            padding: "4px 8px",
                            borderRadius: "8px",
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <IconButton
                          onClick={() => openDialog(resp)}
                          sx={{ color: "#764ba2" }}
                        >
                          <ConstructionIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItem>
                </ResponseCard>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: "center", p: 4, color: "text.secondary" }}>
              <Typography variant="h6">
                Hiện không có yêu cầu hỗ trợ nào.
              </Typography>
            </Box>
          )}
        </ContentContainer>
      </MainContainer>

      <Dialog
        open={openHandleDialog}
        onClose={() => setOpenHandleDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Xử Lý Yêu Cầu Hỗ Trợ</DialogTitle>
        <DialogContent dividers>
          <Box mb={2}>
            <Typography variant="h6">
              Tiêu đề: {responseToHandle?.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Mô tả: {responseToHandle?.description}
            </Typography>
          </Box>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={handleData.status}
              label="Trạng thái"
              onChange={(e) =>
                setHandleData({ ...handleData, status: e.target.value })
              }
            >
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="in_progress">Đang xử lý</MenuItem>
              <MenuItem value="done">Đã hoàn tất</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Phản hồi của bạn"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={handleData.responseMessage}
            onChange={(e) =>
              setHandleData({ ...handleData, responseMessage: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={() => setOpenHandleDialog(false)}
            sx={{ fontWeight: 600 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSupportResponse}
            color="primary"
            variant="contained"
            sx={{ fontWeight: 600 }}
            disabled={!handleData.responseMessage}
          >
            Gửi Phản Hồi
          </Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default SupportResponsePage;