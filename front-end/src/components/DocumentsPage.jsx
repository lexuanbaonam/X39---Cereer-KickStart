import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  CircularProgress,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Grid,
  styled,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Import CloudUploadIcon
import AttachFileIcon from "@mui/icons-material/AttachFile"; // Import AttachFileIcon for displaying file link
import { toast } from "react-toastify";
import axiosClient from "../api/axiosClient";

// Styled components consistent with SprintsPage.jsx
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

const CreateButton = styled(Button)({
  borderRadius: "12px",
  padding: "12px 32px",
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  background: "white",
  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "white",
    boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4)",
    transform: "translateY(-2px)",
  },
});

const DocumentCard = styled(Paper)({
  margin: "16px 0",
  borderRadius: "16px",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  border: "1px solid rgba(102, 126, 234, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
    transform: "translateY(-2px)",
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
});

const DocumentTitle = styled(Typography)({
  fontSize: "1.4rem",
  fontWeight: 700,
  background: "linear-gradient(45deg, #667eea, #764ba2)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "8px",
});

const DocumentContent = styled(Typography)({
  color: "#6c757d",
  fontSize: "1rem",
  lineHeight: 1.6,
  // Truncate content for display, show full content in dialog
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  marginBottom: "16px",
});

const DateInfo = styled(Typography)({
  color: "#495057",
  fontSize: "0.95rem",
  fontWeight: 500,
  marginBottom: "4px",
});

const ActionButtons = styled(Box)({
  display: "flex",
  gap: "8px",
});

const ActionIconButton = styled(IconButton)(({ color }) => ({
  borderRadius: "10px",
  padding: "8px",
  transition: "all 0.3s ease",
  ...(color === "delete" && {
    color: "#dc3545",
    "&:hover": {
      backgroundColor: "rgba(220, 53, 69, 0.1)",
      transform: "scale(1.1)",
    },
  }),
  ...(color === "edit" && {
    color: "#667eea",
    "&:hover": {
      backgroundColor: "rgba(102, 126, 234, 0.1)",
      transform: "scale(1.1)",
    },
  }),
}));

const EmptyState = styled(Paper)({
  padding: "64px 32px",
  textAlign: "center",
  borderRadius: "16px",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  border: "2px dashed rgba(102, 126, 234, 0.3)",
});

const EmptyStateIcon = styled(Box)({
  fontSize: "4rem",
  marginBottom: "24px",
  opacity: 0.5,
});

const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
});

const LoadingContent = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "24px",
  padding: "48px",
  backgroundColor: "rgba(255, 255, 255, 0.95)",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
});

const StyledDialog = styled(Dialog)({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    padding: "8px",
  },
});

const DialogButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  padding: "8px 24px",
  fontWeight: 600,
  textTransform: "none",
  ...(variant === "delete" && {
    background: "linear-gradient(45deg, #dc3545, #c82333)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #c82333, #a71e2a)",
    },
  }),
  ...(variant === "save" && {
    background: "linear-gradient(45deg, #28a745, #20c997)",
    color: "white",
    "&:hover": {
      background: "linear-gradient(45deg, #20c997, #1e7e34)",
    },
  }),
}));

const DocumentsPage = ({ authToken, setCurrentPage, currentUser }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentDocument, setCurrentDocument] = useState({
    title: "",
    content: "",
    fileUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file
  const fileInputRef = useRef(null); // Ref for the hidden file input
  const [showContentAfterDelay, setShowContentAfterDelay] = useState(false); // New state for delay

  // Function to format date (DD/MM/YYYY)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to fetch documents
  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await axiosClient.get("/documents");
      setDocuments(data);
    } catch (err) {
      const message = err.response?.data?.message || "Lỗi khi tải danh sách tài liệu.";
      setError(message);
      toast.error("Không thể tải tài liệu.");
      console.error("Fetch documents error:", err);
    } finally {
      // Ensure loading state is set to false after fetching
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchDocuments();
    } else {
      setLoading(false);
      setError("Không có token xác thực. Vui lòng đăng nhập lại.");
      // setCurrentPage('/login'); // Uncomment if you have a login page
    }
  }, [authToken, fetchDocuments]);

  // Effect for the 2-second delay
  useEffect(() => {
    if (!loading && !error) {
      // Only start delay timer when actual loading is complete and no error
      const timer = setTimeout(() => {
        setShowContentAfterDelay(true);
      }, 2000); // 2-second delay
      return () => clearTimeout(timer); // Cleanup on unmount or if dependencies change
    } else if (loading || error) {
      // Reset delay state if loading starts again or an error occurs
      setShowContentAfterDelay(false);
    }
  }, [loading, error]); // Re-run when loading or error state changes

  // Handle delete dialog open
  const handleDeleteClick = (document) => {
    setDocumentToDelete(document);
    setOpenDeleteDialog(true);
  };

  // Handle delete dialog close
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDocumentToDelete(null);
  };

  // Handle confirm delete action
  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      const data = await axiosClient.delete(`/documents/${documentToDelete._id}`);
      toast.success(data.message);
      fetchDocuments(); // Refresh the list
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa tài liệu.");
      console.error("Delete document error:", err);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Handle edit dialog open
  const handleEditClick = (document) => {
    // If it's a new document, ensure _id is not present and reset file states
    if (!document._id) {
      setCurrentDocument({ title: "", content: "", fileUrl: "" });
      setSelectedFile(null);
    } else {
      setCurrentDocument(document);
      setSelectedFile(null); // Clear selected file when editing existing document
    }
    setOpenEditDialog(true);
  };

  // Handle edit dialog close
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentDocument({ title: "", content: "", fileUrl: "" });
    setSelectedFile(null); // Clear selected file on dialog close
  };

  // Handle input change for edit/create form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDocument((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // Clear selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input element
    }
    setCurrentDocument((prev) => ({ ...prev, fileUrl: "" })); // Clear fileUrl from currentDocument
  };

  // Handle save (create/update) document
  const handleSaveDocument = async () => {
    let finalFileUrl = currentDocument.fileUrl; // Start with existing fileUrl

    // If a new file is selected, upload it first
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (currentDocument.title) {
        formData.append("title", currentDocument.title);
      }
      if (currentDocument.content) {
        formData.append("content", currentDocument.content);
      }

      try {
        const uploadResponse = await axiosClient.post(
          "/documents/upload",
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        // --- ADD THESE CONSOLE LOGS ---
        console.log("Upload Response Data:", uploadResponse);

        finalFileUrl = uploadResponse.fileUrl;
        toast.success("File đã được tải lên thành công!");

      } catch (err) {
        toast.error(err.response?.data?.message || "Lỗi khi tải file lên.");
        console.error("Upload file error:", err);
        return;
      }
    }

    // Prepare payload for document creation/update
    const payload = {
      title: currentDocument.title,
      content: currentDocument.content,
      fileUrl: finalFileUrl, // Use the new fileUrl if uploaded, otherwise existing or empty
    };

    const url = currentDocument._id
      ? `/documents/${currentDocument._id}`
      : "/documents";

    try {
      let data;
      if (currentDocument._id) {
        data = await axiosClient.put(url, payload);
        toast.success("Tài liệu đã được cập nhật thành công!");
      } else {
        data = await axiosClient.post(url, payload);
        toast.success("Tài liệu đã được tạo thành công!");
      }

      fetchDocuments(); // Refresh the list
      handleCloseEditDialog();
    } catch (err) {
      toast.error(err.response?.data?.message || `Lỗi khi ${currentDocument._id ? "cập nhật" : "tạo"} tài liệu.`);
      console.error("Save document error:", err);
    }
  };

  // Display loading screen if still loading OR waiting for the artificial delay
  if (loading || !showContentAfterDelay) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <CircularProgress size={48} sx={{ color: "#667eea" }} />
          <Typography variant="h6" sx={{ color: "#667eea", fontWeight: 600 }}>
            Đang tải tài liệu...
          </Typography>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  // Display error screen if there's an error after loading (and delay)
  if (error) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <Typography color="error" variant="h6" sx={{ marginBottom: 3 }}>
            {error}
          </Typography>
          <CreateButton onClick={fetchDocuments}>Thử lại</CreateButton>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  return (
    <Root>
      <MainContainer elevation={0}>
        <Header>
          <HeaderTitle variant="h3">Quản lý Tài liệu</HeaderTitle>
          <HeaderSubtitle variant="h6">
            Theo dõi và quản lý các tài liệu của bạn
          </HeaderSubtitle>
        </Header>

        <ContentContainer>
          <ActionBar>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Danh sách Tài liệu ({documents.length})
            </Typography>
            <CreateButton
              startIcon={<AddIcon />}
              onClick={() =>
                handleEditClick({ title: "", content: "", fileUrl: "" })
              }
            >
              Tạo Tài liệu Mới
            </CreateButton>
          </ActionBar>

          {documents.length === 0 ? (
            <EmptyState elevation={0}>
              <EmptyStateIcon>📄</EmptyStateIcon>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  marginBottom: 2,
                  color: "#6c757d",
                }}
              >
                Chưa có tài liệu nào
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#6c757d",
                  marginBottom: 3,
                  fontSize: "1.1rem",
                }}
              >
                Bắt đầu bằng cách tạo tài liệu đầu tiên của bạn
              </Typography>
              <CreateButton
                startIcon={<AddIcon />}
                onClick={() =>
                  handleEditClick({ title: "", content: "", fileUrl: "" })
                }
              >
                Tạo Tài liệu Đầu Tiên
              </CreateButton>
            </EmptyState>
          ) : (
            <Box>
              {documents.map((document) => (
                <DocumentCard key={document._id} elevation={0}>
                  <Box sx={{ padding: "24px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "16px",
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <DocumentTitle>{document.title}</DocumentTitle>
                        <DocumentContent>
                          {document.content || "Không có nội dung"}
                        </DocumentContent>
                        {document.fileUrl && (
                          <Box sx={{ marginBottom: "8px" }}>
                            <Chip
                              icon={<AttachFileIcon />}
                              label="Xem File đính kèm"
                              onClick={() =>
                                window.open(
                                  `http://localhost:3000${document.fileUrl}`,
                                  "_blank"
                                )
                              }
                              color="primary"
                              variant="outlined"
                              sx={{ cursor: "pointer" }}
                            />
                          </Box>
                        )}
                      </Box>
                      <ActionButtons>
                        <ActionIconButton
                          color="edit"
                          onClick={() => handleEditClick(document)}
                        >
                          <EditIcon />
                        </ActionIconButton>
                        <ActionIconButton
                          color="delete"
                          onClick={() => handleDeleteClick(document)}
                        >
                          <DeleteIcon />
                        </ActionIconButton>
                      </ActionButtons>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                      <DateInfo>
                        Tạo lúc: {formatDate(document.createdAt)}
                      </DateInfo>
                    </Box>
                  </Box>
                </DocumentCard>
              ))}
            </Box>
          )}
        </ContentContainer>
      </MainContainer>

      {/* Delete Confirmation Dialog */}
      <StyledDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "#dc3545",
          }}
        >
          ⚠️ Xác nhận xóa Tài liệu
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.1rem", color: "#495057" }}>
            Bạn có chắc chắn muốn xóa tài liệu{" "}
            <Typography
              component="span"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(45deg, #667eea, #764ba2)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              "{documentToDelete?.title}"
            </Typography>{" "}
            không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              borderRadius: "8px",
              padding: "8px 24px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Hủy
          </Button>
          <DialogButton
            variant="delete"
            onClick={handleConfirmDelete}
            autoFocus
          >
            Xóa Tài liệu
          </DialogButton>
        </DialogActions>
      </StyledDialog>

      {/* Edit/Create Document Dialog */}
      <StyledDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "#667eea",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {currentDocument._id ? "Chỉnh sửa Tài liệu" : "Tạo Tài liệu Mới"}
          <IconButton onClick={handleCloseEditDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ paddingTop: "20px" }}>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Tiêu đề Tài liệu"
            type="text"
            fullWidth
            variant="outlined"
            value={currentDocument.title}
            onChange={handleInputChange}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            margin="dense"
            name="content"
            label="Nội dung Tài liệu"
            type="text"
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={currentDocument.content}
            onChange={handleInputChange}
            sx={{ marginBottom: "16px" }}
          />

          {/* File Upload Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current.click()}
              sx={{
                borderRadius: "8px",
                padding: "10px 20px",
                textTransform: "none",
                flexShrink: 0,
              }}
            >
              Chọn File
            </Button>
            {(selectedFile || currentDocument.fileUrl) && (
              <Chip
                label={
                  selectedFile
                    ? selectedFile.name
                    : currentDocument.fileUrl.split("/").pop()
                }
                onDelete={handleClearFile}
                color="info"
                variant="outlined"
                sx={{ flexGrow: 1, maxWidth: "calc(100% - 150px)" }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            onClick={handleCloseEditDialog}
            sx={{
              borderRadius: "8px",
              padding: "8px 24px",
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            Hủy
          </Button>
          <DialogButton
            variant="save"
            onClick={handleSaveDocument}
            startIcon={<SaveIcon />}
          >
            {currentDocument._id ? "Lưu Thay Đổi" : "Tạo Tài liệu"}
          </DialogButton>
        </DialogActions>
      </StyledDialog>
    </Root>
  );
};

export default DocumentsPage;
