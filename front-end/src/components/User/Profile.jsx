import React, { useState, useEffect, useRef } from "react";
import {
  Typography,
  Box,
  Avatar,
  Button,
  TextField,
  Grid,
  styled,
  Paper,
  CircularProgress,
  LinearProgress, // Added for upload progress
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify"; // Ensure toast is configured in your app

// Define Root styled component outside the component to avoid re-creation on render
const Root = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  background: "#f0f2f5", // Lighter background for the entire page
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  fontFamily: 'Inter, sans-serif', // Set global font
}));

// Define MainContent styled component outside the component to avoid re-creation on render
const MainContent = styled(Paper)(({ theme }) => ({
  maxWidth: "900px",
  width: "100%",
  borderRadius: "24px",
  background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  overflow: "hidden",
}));

// Define CoverImage styled component outside the component to avoid re-creation on render
const CoverImage = styled(Box)({
  width: "100%",
  height: "200px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  position: "relative",
});

// Define ProfileHeader styled component outside the component to avoid re-creation on render
const ProfileHeader = styled(Box)({
  display: "flex",
  alignItems: "flex-end",
  gap: "24px",
  padding: "32px",
  marginTop: "-80px",
  position: "relative",
  zIndex: 1,
  flexWrap: 'wrap', // Allow wrapping on small screens
});

// Define ProfileAvatar styled component outside the component to avoid re-creation on render
const ProfileAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  border: "6px solid #ffffff",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  flexShrink: 0, // Prevent shrinking on small screens
});

// Define ProfileName styled component outside the component to avoid re-creation on render
const ProfileName = styled(Typography)({
  fontWeight: 700,
  fontSize: "2rem",
  background: "linear-gradient(45deg, #667eea, #764ba2)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "8px",
});

// Define UserBio styled component outside the component to avoid re-creation on render
const UserBio = styled(Typography)({
  color: "#6c757d",
  fontSize: "1.1rem",
  maxWidth: "600px",
  lineHeight: 1.6,
});

// Define SectionTitle styled component outside the component to avoid re-creation on render
const SectionTitle = styled(Typography)({
  fontSize: "1.5rem",
  fontWeight: 700,
  background: "linear-gradient(45deg, #667eea, #764ba2)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginBottom: "24px",
  marginTop: "32px",
});

// Define FormContainer styled component outside the component to avoid re-creation on render
const FormContainer = styled(Box)({
  padding: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

// Define StyledTextField styled component outside the component to avoid re-creation on render
const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#e0e0e0",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#667eea",
    },
    "&.Mui-disabled": {
      backgroundColor: "#f8f9fa",
      "& fieldset": {
        borderColor: "#e9ecef",
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "#6c757d",
    fontSize: "1rem",
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#667eea",
    },
  },
  "& .MuiInputBase-input": {
    fontSize: "1.1rem",
    padding: "16px 14px",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#6c757d",
    WebkitTextFillColor: "#6c757d",
  },
});

// Define ActionButtons styled component outside the component to avoid re-creation on render
const ActionButtons = styled(Box)({
  display: "flex",
  gap: "16px",
  justifyContent: "flex-end",
  padding: "0 32px 24px 32px",
  flexWrap: 'wrap', // Allow wrapping on small screens
});

// Define StyledButton styled component outside the component to avoid re-creation on render
const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: "12px",
  padding: "12px 32px",
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none",
  transition: "all 0.3s ease",
  ...(variant === "contained" && {
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
    "&:hover": {
      background: "linear-gradient(45deg, #5a6fd8, #6a4190)",
      boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4)",
      transform: "translateY(-2px)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#667eea",
    color: "#667eea",
    borderWidth: "2px",
    "&:hover": {
      borderColor: "#5a6fd8",
      backgroundColor: "rgba(102, 126, 234, 0.04)",
      borderWidth: "2px",
      transform: "translateY(-2px)",
    },
  }),
}));

// Define FileUploadArea styled component outside the component to avoid re-creation on render
const FileUploadArea = styled(Box)({
  border: "2px dashed #667eea",
  borderRadius: "16px",
  padding: "48px 32px",
  textAlign: "center",
  backgroundColor: "rgba(102, 126, 234, 0.04)",
  cursor: "pointer",
  margin: "0 32px 32px 32px",
  transition: "all 0.3s ease",
  "&:hover": {
    borderColor: "#5a6fd8",
    backgroundColor: "rgba(102, 126, 234, 0.08)",
    transform: "translateY(-2px)",
  },
});

// Define LoadingContainer styled component outside the component to avoid re-creation on render
const LoadingContainer = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
});

// Define LoadingContent styled component outside the component to avoid re-creation on render
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

function SettingPage({ setCurrentPage, currentUser, authToken, onProfileUpdate }) {
  // State for editing mode and loading status
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false); // New state for file upload
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress
  const fileInputRef = useRef(null); // Ref for the hidden file input

  // State for profile fields
  const [personalEmail, setPersonalEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); // New state for avatar URL

  // State to store original data for cancellation
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (currentUser) {
      setPersonalEmail(currentUser.personalEmail || "");
      setName(currentUser.name || "");
      setPhoneNumber(currentUser.phoneNumber || "");
      setDob(currentUser.dob ? currentUser.dob.split("T")[0] : "");
      setBio(currentUser.bio || "");
      // Chỉnh sửa: Lấy giá trị vai trò từ currentUser.roleTag
      setRole(currentUser.roleTag || "");
      setAvatarUrl(currentUser.avatarUrl || "https://placehold.co/120x120/E0E0E0/6C757D?text=Avatar"); // Default avatar
      setOriginalData({ ...currentUser, role: currentUser.roleTag || "" }); // Ensure originalData also reflects roleTag
      setLoading(false);
    } else if (authToken) {
      const loadProfileData = async () => {
        setLoading(true);
        // Assuming onProfileUpdate fetches and returns user data
        const profileResult = await onProfileUpdate(authToken);
        if (profileResult && profileResult.needsProfileCreation) {
          toast.error("Không tìm thấy hồ sơ. Vui lòng tạo hồ sơ trước.");
          setCurrentPage("/create-profile");
        } else if (profileResult && profileResult.error) {
          toast.error("Lỗi khi tải hồ sơ. Vui lòng thử lại.");
          setCurrentPage("/login");
        } else {
          // If onProfileUpdate directly sets currentUser, this block might be redundant
          // For now, if profileResult is available and valid, update states
          if (profileResult) {
            setPersonalEmail(profileResult.personalEmail || "");
            setName(profileResult.name || "");
            setPhoneNumber(profileResult.phoneNumber || "");
            setDob(profileResult.dob ? profileResult.dob.split("T")[0] : "");
            setBio(profileResult.bio || "");
            // Chỉnh sửa: Lấy giá trị vai trò từ profileResult.roleTag
            setRole(profileResult.roleTag || "");
            setAvatarUrl(profileResult.avatarUrl || "https://placehold.co/120x120/E0E0E0/6C757D?text=Avatar");
            setOriginalData({ ...profileResult, role: profileResult.roleTag || "" }); // Ensure originalData also reflects roleTag
          }
          // If profileResult is null or unexpected, redirect to login
          if (!profileResult && window.location.pathname !== "/login") {
            setCurrentPage("/login");
          }
        }
        setLoading(false);
      };
      loadProfileData();
    } else {
      // If no currentUser and no authToken, redirect to login
      if (setCurrentPage && window.location.pathname !== "/login") {
        setCurrentPage("/login");
      }
      setLoading(false);
    }
  }, [currentUser, authToken, setCurrentPage, onProfileUpdate]);

  // Handlers
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    // When starting to edit, save current data as original
    if (!isEditing) {
      setOriginalData({ personalEmail, name, phoneNumber, dob, bio, role, avatarUrl });
    }
  };

  const handleSave = async () => {
    const changes = {};
    if (personalEmail !== originalData.personalEmail) changes.personalEmail = personalEmail;
    if (name !== originalData.name) changes.name = name;
    if (phoneNumber !== originalData.phoneNumber) changes.phoneNumber = phoneNumber;
    if (dob !== originalData.dob) changes.dob = dob;
    if (bio !== originalData.bio) changes.bio = bio;
    if (avatarUrl !== originalData.avatarUrl) changes.avatarUrl = avatarUrl; // Include avatar URL in changes

    if (Object.keys(changes).length === 0) {
      toast.info("Không có thay đổi nào để lưu.");
      setIsEditing(false);
      return;
    }

    try {
      // Placeholder for your actual API endpoint for updating user profile
      const response = await fetch("https://back-end-hk2p.onrender.com/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(changes),
      });

      if (response.ok) {
        toast.success("Hồ sơ đã được cập nhật thành công!");
        setIsEditing(false);
        // Re-fetch profile data to update currentUser in parent component
        await onProfileUpdate(authToken);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Cập nhật hồ sơ thất bại.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Đã xảy ra lỗi mạng khi cập nhật hồ sơ. Vui lòng thử lại.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revert to original data
    setPersonalEmail(originalData.personalEmail || "");
    setName(originalData.name || "");
    setPhoneNumber(originalData.phoneNumber || "");
    setDob(originalData.dob ? originalData.dob.split("T")[0] : "");
    setBio(originalData.bio || "");
    setRole(originalData.role || ""); // Revert to original role
    setAvatarUrl(originalData.avatarUrl || "https://placehold.co/120x120/E0E0E0/6C757D?text=Avatar");
  };

  const handleFileUploadClick = () => {
    if (!isEditing) return; // Only allow file upload when in editing mode
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    // Basic file validation
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Định dạng tệp không hợp lệ. Chỉ chấp nhận JPG, PNG, GIF, SVG.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Kích thước tệp quá lớn. Tối đa 5MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload with a FormData object
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // Placeholder for your actual avatar upload API endpoint
      // This is where you would send the formData to your backend
      // Example with a dummy progress update
      const uploadApiUrl = "https://back-end-hk2p.onrender.com/api/upload-avatar"; // Replace with your actual endpoint

      // Simulate progress for demonstration
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
        setUploadProgress(i);
      }

      // After simulated upload, assume success and get a new URL
      // In a real application, the server would return the new avatarUrl
      const newAvatarUrl = URL.createObjectURL(file); // For local preview

      setAvatarUrl(newAvatarUrl); // Update local state with the new avatar URL
      toast.success("Ảnh đại diện đã được tải lên thành công!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Đã xảy ra lỗi khi tải ảnh đại diện lên.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0); // Reset progress
      // Clear the input value so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingContent>
          <CircularProgress size={48} sx={{ color: "#667eea" }} />
          <Typography variant="h6" sx={{ color: "#667eea", fontWeight: 600 }}>
            Đang tải hồ sơ...
          </Typography>
        </LoadingContent>
      </LoadingContainer>
    );
  }

  if (!currentUser) return null;

  return (
    <Root>
      <MainContent elevation={0}>
        <CoverImage />
        <ProfileHeader>
          <ProfileAvatar
            src={avatarUrl} // Use local state for avatar URL
            alt={currentUser?.name || "User Avatar"}
            onError={(e) => { e.target.src = "https://placehold.co/120x120/E0E0E0/6C757D?text=Avatar"; }} // Fallback on error
          />
          <Box>
            <ProfileName variant="h4">
              {currentUser?.name || "Người dùng"}
            </ProfileName>
            <UserBio variant="body1">
              {bio || "Chưa có tiểu sử."}
            </UserBio>
          </Box>
        </ProfileHeader>

        <ActionButtons style={{"paddingBottom":"0px"}}>
          {isEditing ? (
            <>
              <StyledButton variant="contained" onClick={handleSave} disabled={isUploading}>
                {isUploading ? <CircularProgress size={24} color="inherit" /> : "Lưu"}
              </StyledButton>
              <StyledButton variant="outlined" onClick={handleCancel} disabled={isUploading}>
                Hủy
              </StyledButton>
            </>
          ) : (
            <StyledButton variant="contained" onClick={handleEditToggle}>
              Chỉnh sửa hồ sơ
            </StyledButton>
          )}
        </ActionButtons>

        <FormContainer style={{"paddingTop":"0px"}}>
          <SectionTitle variant="h5">Thông tin cá nhân</SectionTitle>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Email row */}
            <StyledTextField
              label="Email Cá Nhân"
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
              disabled={!isEditing}
              type="email"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {/* Name, Phone, DOB, Role row */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Số Điện Thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={!isEditing}
                  type="tel"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Ngày Sinh"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  disabled={!isEditing}
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  label="Vai trò"
                  value={role}
                  disabled // Role is typically not editable by user
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            {/* Bio row */}
            <StyledTextField
              label="Tiểu sử"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={!isEditing}
              multiline
              minRows={3}
              fullWidth
              InputLabelProps={{ shrink: true }}
              placeholder="Viết một chút về bản thân bạn..."
            />
          </Box>

          <SectionTitle variant="h5">Cập nhật ảnh đại diện</SectionTitle>
        </FormContainer>

        <FileUploadArea onClick={handleFileUploadClick} sx={{ cursor: isEditing ? 'pointer' : 'not-allowed' }}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/gif, image/svg+xml"
            style={{ display: "none" }} // Hide the actual input
            disabled={!isEditing || isUploading}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            {isUploading ? (
              <>
                <CircularProgress sx={{ color: "#667eea" }} />
                <Typography variant="h6" sx={{ color: "#667eea", fontWeight: 600 }}>
                  Đang tải lên ({uploadProgress}%)
                </Typography>
                <Box sx={{ width: '80%', mt: 1 }}>
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
              </>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 48, color: "#667eea" }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#667eea",
                    fontWeight: 600,
                    marginBottom: 1,
                  }}
                >
                  {isEditing ? "Nhấp để tải ảnh lên hoặc kéo và thả" : "Vui lòng bật chế độ chỉnh sửa để tải ảnh lên"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#6c757d",
                    fontSize: "1rem",
                  }}
                >
                  SVG, PNG, JPG hoặc GIF (tối đa 5MB)
                </Typography>
              </>
            )}
          </Box>
        </FileUploadArea>
      </MainContent>
    </Root>
  );
}

export default SettingPage;
