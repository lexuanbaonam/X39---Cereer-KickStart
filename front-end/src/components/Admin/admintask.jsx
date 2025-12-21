import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Paper,
  Stack,
  Grid,
} from "@mui/material";
import "./admintask.css";

const TASK_STATUSES = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "inprogress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
];

function generateWeeks() {
  const weeks = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y <= currentYear + 3; y++) {
    for (let w = 1; w <= 52; w++) {
      weeks.push(`${y}-W${w.toString().padStart(2, "0")}`);
    }
  }
  return weeks;
}

export default function AdminTask() {
  const [tasks, setTasks] = useState([]);
  const [filterWeek, setFilterWeek] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [openForm, setOpenForm] = useState(false);

  // Form input state
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState(""); // thêm mô tả
  const [newTaskWeek, setNewTaskWeek] = useState("");
  const [newTaskAssignee, setNewTaskAssignee] = useState(""); // người thực hiện
  const [newTaskStatus, setNewTaskStatus] = useState("pending");
  const [newTaskDeadline, setNewTaskDeadline] = useState(""); // thời hạn hoàn thành (date)

  const weeks = useMemo(() => ["all", ...generateWeeks()], []);

  const filteredTasks = tasks.filter((task) => {
    const matchWeek = filterWeek === "all" || task.week === filterWeek;
    const matchStatus = filterStatus === "all" || task.status === filterStatus;
    const matchText =
      task.name.toLowerCase().includes(searchText.trim().toLowerCase()) ||
      task.desc.toLowerCase().includes(searchText.trim().toLowerCase());
    return matchWeek && matchStatus && matchText;
  });

  const countTotal = tasks.length;
  const countCompleted = tasks.filter((t) => t.status === "completed").length;
  const countInProgress = tasks.filter((t) => t.status === "inprogress").length;
  const countPending = tasks.filter((t) => t.status === "pending").length;

  function handleOpenForm() {
    setOpenForm(true);
    setNewTaskName("");
    setNewTaskDesc("");
    setNewTaskWeek(weeks[1] || "");
    setNewTaskAssignee("");
    setNewTaskStatus("pending");
    setNewTaskDeadline("");
  }

  function handleCloseForm() {
    setOpenForm(false);
  }

  function handleCreateTask() {
    if (!newTaskName.trim() || !newTaskWeek) {
      alert("Vui lòng nhập tên task và chọn tuần");
      return;
    }
    const newTask = {
      id: Date.now(),
      name: newTaskName.trim(),
      desc: newTaskDesc.trim(),
      week: newTaskWeek,
      assignee: newTaskAssignee.trim(),
      status: newTaskStatus,
      deadline: newTaskDeadline,
    };
    setTasks((prev) => [...prev, newTask]);
    setOpenForm(false);
  }

  return (
    <Box className="adminTaskContainer" sx={{ maxWidth: 960, mx: "auto", p: 3 }}>
      <Typography variant="h5" fontWeight="bold" mb={2} className="headerTitle">
        Hệ thống Quản lý Task
      </Typography>

      {/* Thống kê */}
      <Box className="statContainer">
        <Paper className="statCard totalTasks" elevation={1}>
          <Typography variant="h6" className="statCount">
            {countTotal}
          </Typography>
          <Typography variant="body2">Tổng số nhiệm vụ</Typography>
        </Paper>
        <Paper className="statCard completedTasks" elevation={1}>
          <Typography variant="h6" className="statCount">
            {countCompleted}
          </Typography>
          <Typography variant="body2">Hoàn thành</Typography>
        </Paper>
        <Paper className="statCard inProgressTasks" elevation={1}>
          <Typography variant="h6" className="statCount">
            {countInProgress}
          </Typography>
          <Typography variant="body2">Đang thực hiện</Typography>
        </Paper>
        <Paper className="statCard pendingTasks" elevation={1}>
          <Typography variant="h6" className="statCount">
            {countPending}
          </Typography>
          <Typography variant="body2">Chờ xử lý</Typography>
        </Paper>
      </Box>

      {/* Tìm kiếm & lọc */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        mb={3}
      >
        <TextField
          size="small"
          placeholder="Tìm kiếm task..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 300 }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Tuần</InputLabel>
          <Select
            value={filterWeek}
            label="Tuần"
            onChange={(e) => setFilterWeek(e.target.value)}
          >
            <MenuItem value="all">Tất cả tuần</MenuItem>
            {weeks
              .filter((w) => w !== "all")
              .map((week) => (
                <MenuItem key={week} value={week}>
                  {week}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={filterStatus}
            label="Trạng thái"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">Tất cả trạng thái</MenuItem>
            {TASK_STATUSES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleOpenForm}>
          Tạo Task Mới
        </Button>
      </Stack>

      {/* Danh sách task hoặc thông báo */}
      {filteredTasks.length === 0 ? (
        <Box className="emptyTaskBox">
          <Box component="span" className="emptyTaskIcon">
            📅
          </Box>
          <Typography variant="h6" mb={1}>
            Chưa có task nào
          </Typography>
          <Typography variant="body2" mb={2}>
            Hãy tạo task đầu tiên để bắt đầu quản lý công việc
          </Typography>
          <Button variant="contained" onClick={handleOpenForm}>
            Tạo Task Đầu Tiên
          </Button>
        </Box>
      ) : (
        <Box>
          {filteredTasks.map((task) => {
            const statusLabel =
              TASK_STATUSES.find((s) => s.value === task.status)?.label || "";
            return (
              <Paper key={task.id} className="taskItem" elevation={1}>
                <Box>
                  <Typography fontWeight="bold">{task.name}</Typography>
                  {task.desc && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {task.desc}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                    Tuần: {task.week} | Người thực hiện: {task.assignee || "Chưa có"} |{" "}
                    Trạng thái: {statusLabel} | Hạn hoàn thành:{" "}
                    {task.deadline || "Chưa có"}
                  </Typography>
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}

      {/* Form Tạo/Sửa task */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth maxWidth="sm">
        <DialogTitle>Tạo Task Mới</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            {/* Tên Task */}
            <TextField
              label="Tên task"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              fullWidth
              autoFocus
            />

            {/* Mô tả Task (multiline) */}
            <TextField
              label="Mô tả task"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              fullWidth
              multiline
              rows={2}
            />

            {/* Tuần thực hiện & Người thực hiện */}
            <Box display="flex" gap={2}>
              <FormControl fullWidth>
                <InputLabel>Tuần thực hiện</InputLabel>
                <Select
                  value={newTaskWeek}
                  label="Tuần thực hiện"
                  onChange={(e) => setNewTaskWeek(e.target.value)}
                >
                  {weeks
                    .filter((w) => w !== "all")
                    .map((week) => (
                      <MenuItem key={week} value={week}>
                        {week}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <TextField
                label="Người thực hiện"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                fullWidth
              />
            </Box>

            {/* Trạng thái & Thời hạn hoàn thành */}
            <Box display="flex" gap={2} alignItems="center">
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={newTaskStatus}
                  label="Trạng thái"
                  onChange={(e) => setNewTaskStatus(e.target.value)}
                >
                  {TASK_STATUSES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Thời hạn hoàn thành"
                type="date"
                value={newTaskDeadline}
                onChange={(e) => setNewTaskDeadline(e.target.value)}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseForm}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateTask}>
            Tạo Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
