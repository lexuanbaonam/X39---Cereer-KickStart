import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const CreateSprint = ({ authToken, setCurrentPage }) => {
  const [title, setTitle] = useState("");
  // Đã đổi tên state từ 'description' sang 'describe'
  const [describe, setDescribe] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Helper to get today's date in YYYY-MM-DD format for min attribute
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!title || !startDate || !endDate) {
      toast.error("Vui lòng điền đầy đủ các thông tin bắt buộc.");
      setLoading(false);
      return;
    }

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (end.isBefore(start)) {
      toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://back-end-hk2p.onrender.com/api/sprints/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          describe,
          startDate: start.format("YYYY-MM-DD"),
          endDate: end.format("YYYY-MM-DD"),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Tạo sprint thành công!");
        // Reset form fields
        setTitle("");
        setDescribe("");
        setStartDate("");
        setEndDate("");
        setCurrentPage("/sprints"); // Navigate back to sprints list after success
      } else {
        toast.error(data.message || "Có lỗi xảy ra khi tạo sprint.");
        console.error("Lỗi từ server:", data.error || data);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu tạo sprint:", error);
      toast.error("Không thể kết nối đến server hoặc có lỗi mạng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 650,
          width: "100%",
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Tạo Sprint Mới
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.1rem" }}
          >
            Điền thông tin để tạo sprint cho dự án của bạn
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Title Field */}
            <TextField
              fullWidth
              label="Tiêu đề Sprint"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />

            {/* Description Field */}
            <TextField
              fullWidth
              label="Mô tả Sprint"
              variant="outlined"
              multiline
              rows={4}
              value={describe} // Sử dụng state 'describe'
              onChange={(e) => setDescribe(e.target.value)} // Cập nhật state 'describe'
              placeholder="Mô tả chi tiết về mục tiêu và phạm vi của sprint..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#667eea",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#667eea",
                },
              }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !startDate,
                        helperText: !startDate
                          ? "Vui lòng chọn ngày bắt đầu"
                          : "",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": { borderColor: "#667eea" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#667eea",
                          },
                        },
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Ngày kết thúc"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    format="DD/MM/YYYY"
                    minDate={startDate || dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        error: !endDate,
                        helperText: !endDate
                          ? "Vui lòng chọn ngày kết thúc"
                          : "",
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": { borderColor: "#667eea" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#667eea",
                            },
                          },
                          "& .MuiInputLabel-root.Mui-focused": {
                            color: "#667eea",
                          },
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #5a6fd8, #6a4190)",
                    boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(45deg, #ccc, #999)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Tạo Sprint"
                )}
              </Button>

              <Button
                variant="outlined"
                onClick={() => setCurrentPage("/sprints")}
                sx={{
                  flex: 1,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: "#667eea",
                  color: "#667eea",
                  borderWidth: 2,
                  "&:hover": {
                    borderColor: "#5a6fd8",
                    backgroundColor: "rgba(102, 126, 234, 0.04)",
                    borderWidth: 2,
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateSprint;
