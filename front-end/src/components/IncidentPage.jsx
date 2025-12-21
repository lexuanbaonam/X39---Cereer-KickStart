import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  useTheme,
  Card, // Retaining Card for IncidentCard for consistency with previous version, but styling like Paper
  Chip,
  Avatar,
  Divider,
  styled, // Import styled
  Paper, // Import Paper for MainContainer and EmptyState
  Grid, // Import Grid for layout
} from "@mui/material";
import {
  AddCircleOutline as AddCircleOutlineIcon,
  BugReport as BugReportIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  // Removed EditIcon as per request
} from "@mui/icons-material";
import { toast } from "react-toastify";

const API_BASE_URL = "https://back-end-hk2p.onrender.com/api";
const LOADING_DELAY_MS = 1000;

// Styled Components (Adapted from SprintsPage.jsx)
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
  flexWrap: 'wrap', // Allow wrapping on smaller screens
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
  color: '#667eea', // Text color to match gradient
  '&:hover': {
    background: 'white',
    boxShadow: '0 12px 24px rgba(102, 126, 234, 0.4)',
    transform: 'translateY(-2px)',
  },
});

const IncidentCard = styled(Paper)({ // Changed from Card to Paper for consistency with SprintsPage
  margin: '16px 0',
  borderRadius: '16px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid rgba(102, 126, 234, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    transform: 'translateY(-2px)',
    borderColor: 'rgba(102, 126, 234, 0.2)',
  },
});

const IncidentTitle = styled(Typography)({
  fontSize: '1.4rem',
  fontWeight: 700,
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  marginBottom: '8px',
});

const IncidentDescription = styled(Typography)({
  color: '#6c757d',
  fontSize: '1rem',
  lineHeight: 1.6,
  marginBottom: '16px',
});

const DateInfo = styled(Typography)({
  color: '#495057',
  fontSize: '0.95rem',
  fontWeight: 500,
  marginBottom: '4px',
});

const StyledChip = styled(Chip)(({ customtype, customstatus }) => ({ // Renamed props to avoid conflict with HTML attributes
  borderRadius: '20px',
  fontWeight: 600,
  fontSize: '0.85rem',
  height: '32px',
  // Status specific colors
  ...(customstatus === 'new' && {
    background: 'linear-gradient(45deg, #007bff, #6f42c1)', // info
    color: 'white',
  }),
  ...(customstatus === 'investigating' && {
    background: 'linear-gradient(45deg, #ffc107, #fd7e14)', // warning
    color: 'white',
  }),
  ...(customstatus === 'resolved' && {
    background: 'linear-gradient(45deg, #28a745, #20c997)', // success
    color: 'white',
  }),
  ...(customstatus === 'closed' && {
    background: 'linear-gradient(45deg, #6c757d, #495057)', // default
    color: 'white',
  }),

  ...(customtype === 'system' && {
    background: 'linear-gradient(45deg, #007bff, #6f42c1)', // primary
    color: 'white',
  }),
  ...(customtype === 'data' && {
    background: 'linear-gradient(45deg, #6f42c1, #dc3545)', // secondary (adjusted for better contrast)
    color: 'white',
  }),
  ...(customtype === 'security' && {
    background: 'linear-gradient(45deg, #dc3545, #c82333)', // error
    color: 'white',
  }),
}));


const EmptyState = styled(Paper)({ // Changed from Box to Paper
  padding: '64px 32px',
  textAlign: 'center',
  borderRadius: '16px',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
  border: '2px dashed rgba(102, 126, 234, 0.3)',
});

const EmptyStateIcon = styled(Box)({
  fontSize: '4rem',
  marginBottom: '24px',
  opacity: 0.5,
});

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
});

const LoadingContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  padding: '48px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '24px',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: '8px',
  },
});

const DialogButton = styled(Button)(({ variant }) => ({
  borderRadius: '8px',
  padding: '8px 24px',
  fontWeight: 600,
  textTransform: 'none',
  ...(variant === 'primary' && {
    background: 'linear-gradient(45deg, #667eea, #764ba2)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(45deg, #764ba2, #667eea)',
    },
  }),
}));


function IncidentPage({ authToken, currentUserId, currentUserRoleTag }) {
  const [openForm, setOpenForm] = useState(false);
  const [incidentTitle, setIncidentTitle] = useState("");
  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentType, setIncidentType] = useState("system");
  const [incidents, setIncidents] = useState([]);
  const [loadingIncidents, setLoadingIncidents] = useState(true);
  const [loadingIncidentCreation, setLoadingIncidentCreation] = useState(false);
  const [error, setError] = useState(null);

  // Removed states for handling incident: openHandleForm, handlingIncident, handleStatus, handleResolutionNote, loadingIncidentHandling

  const theme = useTheme();

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Fetch all incidents
  const fetchIncidents = useCallback(async () => {
    if (!authToken) {
      toast.error("Không tìm thấy token xác thực. Vui lòng đăng nhập lại.");
      setLoadingIncidents(false);
      return;
    }

    setLoadingIncidents(true);
    try {
      const response = await fetch(`${API_BASE_URL}/incidents`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể tải danh sách sự cố");
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        setIncidents(data);
      } else {
        toast.error("Dữ liệu sự cố trả về không hợp lệ.");
        setIncidents([]);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sự cố:", err);
      setError((prev) => (prev ? new Error(`${prev.message}\n${err.message}`) : err));
      toast.error(`Lỗi khi tải danh sách sự cố: ${err.message}`);
    } finally {
      await delay(LOADING_DELAY_MS);
      setLoadingIncidents(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const handleOpenForm = () => {
    setIncidentTitle("");
    setIncidentDescription("");
    setIncidentType("system");
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setIncidentTitle("");
    setIncidentDescription("");
    setIncidentType("system");
  };

  const handleCreateIncident = async () => {
    if (!incidentTitle || !incidentDescription || !incidentType) {
      toast.warn("Vui lòng điền đầy đủ thông tin sự cố.");
      return;
    }

    setLoadingIncidentCreation(true);
    try {
      const response = await fetch(`${API_BASE_URL}/incidents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: incidentTitle,
          description: incidentDescription,
          type: incidentType,
        }),
      });

      const data = await response.json();
      if (response.status === 201) {
        toast.success("Báo cáo sự cố thành công!");
        handleCloseForm();
        fetchIncidents(); // Refresh the list
      } else {
        toast.error(`Lỗi khi báo cáo sự cố: ${data.message || "Lỗi không xác định"}`);
      }
    } catch (err) {
      console.error("Lỗi khi báo cáo sự cố:", err);
      toast.error(`Lỗi khi báo cáo sự cố: ${err.message}`);
    } finally {
      setLoadingIncidentCreation(false);
    }
  };

  // Removed handleOpenHandleForm, handleCloseHandleForm, handleUpdateIncident functions

  // Check if the current user is an admin or leader (this variable is still useful for filtering incidents)
  const isAdminOrLeader = currentUserRoleTag === "ADMIN" || currentUserRoleTag === "LEADER";

  if (loadingIncidents) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <CircularProgress size={48} sx={{ color: '#667eea' }} />
          <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 600 }}>
            Đang tải sự cố...
          </Typography>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Typography color="error" variant="h6" sx={{ marginBottom: 3 }}>
            {error.message || "Đã xảy ra lỗi khi tải dữ liệu."}
          </Typography>
          <CreateButton onClick={fetchIncidents}>
            Thử lại
          </CreateButton>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  const getStatusChipValue = (status) => {
    return status?.toLowerCase(); // Return lowercase status for customprop
  };

  const getTypeChipValue = (type) => {
    return type?.toLowerCase(); // Return lowercase type for customprop
  };

  const formatVietnameseDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
  };

  // Filter incidents for regular users (only show their reported incidents)
  const filteredIncidents = isAdminOrLeader
    ? incidents
    : incidents.filter((incident) => incident.createdBy._id === currentUserId);

  return (
    <Root>
      <MainContainer elevation={0}>
        <Header>
          <HeaderTitle variant="h3">
            Quản lý Sự cố
          </HeaderTitle>
          <HeaderSubtitle variant="h6">
            Báo cáo và theo dõi các vấn đề trong hệ thống
          </HeaderSubtitle>
        </Header>

        <ContentContainer>
          <ActionBar>
            <Typography variant="h5" sx={{
              fontWeight: 600,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Danh sách Sự cố ({filteredIncidents.length})
            </Typography>
            <CreateButton
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleOpenForm}
            >
              Báo cáo Sự cố Mới
            </CreateButton>
          </ActionBar>

          {filteredIncidents.length === 0 ? (
            <EmptyState elevation={0}>
              <EmptyStateIcon>
                <BugReportIcon sx={{ fontSize: '4rem', color: theme.palette.text.disabled }} />
              </EmptyStateIcon>
              <Typography variant="h5" sx={{
                fontWeight: 600,
                marginBottom: 2,
                color: '#6c757d'
              }}>
                Chưa có sự cố nào được báo cáo
              </Typography>
              <Typography variant="body1" sx={{
                color: '#6c757d',
                marginBottom: 3,
                fontSize: '1.1rem'
              }}>
                Hãy báo cáo một sự cố mới nếu bạn gặp lỗi!
              </Typography>
              <CreateButton
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenForm}
              >
                Báo cáo Sự cố Đầu Tiên
              </CreateButton>
            </EmptyState>
          ) : (
            <Box>
              {filteredIncidents.map((incident) => (
                <IncidentCard key={incident._id} elevation={0}>
                  <Box sx={{ padding: '24px' }}> {/* Use Box for padding inside Card */}
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '16px',
                      flexWrap: 'wrap', // Allow wrapping chips on small screens
                      gap: '8px', // Space between title/description and chips
                    }}>
                      <Box sx={{ flex: 1, minWidth: '200px' }}> {/* Ensure title/description has space */}
                        <IncidentTitle>
                          {incident.title}
                        </IncidentTitle>
                        <IncidentDescription>
                          {incident.description || 'Không có mô tả.'}
                        </IncidentDescription>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}> {/* Chips should not shrink */}
                        <StyledChip
                          label={incident.type?.toUpperCase()}
                          customtype={getTypeChipValue(incident.type)}
                          size="medium"
                        />
                        <StyledChip
                          label={incident.status?.toUpperCase()}
                          customstatus={getStatusChipValue(incident.status)}
                          size="medium"
                        />
                      </Box>
                    </Box>

                    <Grid container spacing={2} sx={{ marginBottom: '16px' }}>
                      <Grid item xs={12} sm={6}>
                        <DateInfo>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 24, height: 24 }}>
                              <PersonIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                            Báo cáo bởi: {incident.createdBy?.fullName || "N/A"}
                          </Box>
                        </DateInfo>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DateInfo>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 24, height: 24 }}>
                              <CalendarIcon sx={{ fontSize: 16 }} />
                            </Avatar>
                            Ngày báo cáo: {formatVietnameseDate(incident.createdAt)}
                          </Box>
                        </DateInfo>
                      </Grid>
                      {incident.handledBy && (
                        <Grid item xs={12} sm={6}>
                          <DateInfo>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ bgcolor: theme.palette.success.main, width: 24, height: 24 }}>
                                <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
                              </Avatar>
                              Xử lý bởi: {incident.handledBy?.fullName || "N/A"} vào {incident.handledAt ? formatVietnameseDate(incident.handledAt) : "N/A"}
                            </Box>
                          </DateInfo>
                        </Grid>
                      )}
                    </Grid>

                    {incident.resolutionNote && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: theme.palette.action.selected, borderRadius: 2 }}>
                        <Typography variant="body1" fontWeight="bold" sx={{ mb: 1 }}>
                          Ghi chú xử lý:
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {incident.resolutionNote}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </IncidentCard>
              ))}
            </Box>
          )}
        </ContentContainer>
      </MainContainer>

      {/* Dialog for Reporting New Incident */}
      <StyledDialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          fontSize: '1.3rem',
          fontWeight: 600,
          color: 'white',
          background: 'linear-gradient(45deg, #667eea, #764ba2)',
        }}>
          Báo cáo Sự cố Mới
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <TextField
            autoFocus
            label="Tiêu đề Sự cố"
            fullWidth
            value={incidentTitle}
            onChange={(e) => setIncidentTitle(e.target.value)}
            sx={{ mb: 2, mt: 2 }}
            required
          />
          <TextField
            label="Mô tả Sự cố"
            fullWidth
            multiline
            rows={4}
            value={incidentDescription}
            onChange={(e) => setIncidentDescription(e.target.value)}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            select
            label="Loại Sự cố"
            fullWidth
            value={incidentType}
            onChange={(e) => setIncidentType(e.target.value)}
            sx={{ mb: 2 }}
            required
          >
            <MenuItem value="system">Hệ thống</MenuItem>
            <MenuItem value="data">Dữ liệu</MenuItem>
            <MenuItem value="security">Bảo mật</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ padding: '16px 24px' }}>
          <Button onClick={handleCloseForm} color="secondary" variant="outlined" sx={{
            borderRadius: '8px',
            padding: '8px 24px',
            fontWeight: 600,
            textTransform: 'none'
          }}>
            Hủy
          </Button>
          <DialogButton
            variant="primary"
            onClick={handleCreateIncident}
            disabled={loadingIncidentCreation}
            startIcon={loadingIncidentCreation ? <CircularProgress size={20} /> : null}
          >
            {loadingIncidentCreation ? "Đang gửi..." : "Gửi Báo cáo"}
          </DialogButton>
        </DialogActions>
      </StyledDialog>

      {/* Removed Dialog for Handling Incident (Admin/Leader) */}
    </Root>
  );
}

export default IncidentPage;
