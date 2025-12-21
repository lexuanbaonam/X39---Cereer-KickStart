import React, { useState, useEffect, useCallback } from "react";
import {
  CircularProgress,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";

import {
  AddCircleOutline as AddCircleOutlineIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  DateRange as DateRangeIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Settings as SprintIcon,
  Group as GroupIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Thêm các import cho DatePicker
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/vi";

// Import CSS
import "./ProjectsPage.css";

const API_BASE_URL = "https://back-end-hk2p.onrender.com/api";

const ProjectsPage = ({ authToken, currentUserId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    teamMembers: [],
  });
  const [loadingCreate, setLoadingCreate] = useState(false);

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [openMembersDialog, setOpenMembersDialog] = useState(false);
  const [openSprintsDialog, setOpenSprintsDialog] = useState(false);
  const [openAddMembersDialog, setOpenAddMembersDialog] = useState(false);
  const [openAddSprintsDialog, setOpenAddSprintsDialog] = useState(false); // New state for add sprints dialog
  const [selectedProject, setSelectedProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [loadingDropdownData, setLoadingDropdownData] = useState(true);

  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState([]);
  const [selectedSprintsToAdd, setSelectedSprintsToAdd] = useState([]); // New state for selected sprints
  const [loadingAddMembers, setLoadingAddMembers] = useState(false);
  const [loadingAddSprints, setLoadingAddSprints] = useState(false); // New state for loading add sprints

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/projects/all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể tải dự án.");
      }
      setProjects(data.projects);
    } catch (err) {
      console.error("Lỗi khi tải dự án:", err);
      setError(err.message);
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const fetchDropdownData = useCallback(async () => {
    setLoadingDropdownData(true);
    try {
      const usersResponse = await fetch(`${API_BASE_URL}/users/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const usersData = await usersResponse.json();
      if (!usersResponse.ok)
        throw new Error(
          usersData.message || "Không thể tải danh sách người dùng."
        );
      setUsers(usersData.users);

      const sprintsResponse = await fetch(`${API_BASE_URL}/sprints/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const sprintsData = await sprintsResponse.json();
      if (!sprintsResponse.ok)
        throw new Error(
          sprintsData.message || "Không thể tải danh sách sprints."
        );
      setSprints(sprintsData.sprints);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu dropdown:", err);
      toast.error(`Lỗi khi tải dữ liệu: ${err.message}`);
    } finally {
      setLoadingDropdownData(false);
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchProjects();
      fetchDropdownData();
    }
  }, [authToken, fetchProjects, fetchDropdownData]);

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
    setNewProject({
      title: "",
      description: "",
      startDate: null,
      endDate: null,
      teamMembers: [],
    });
  };

  const handleNewProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async () => {
    setLoadingCreate(true);
    try {
      if (!newProject.startDate || !newProject.endDate) {
        toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
        setLoadingCreate(false);
        return;
      }
      if (dayjs(newProject.endDate).isBefore(dayjs(newProject.startDate))) {
        toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
        setLoadingCreate(false);
        return;
      }

      const membersToSend = newProject.teamMembers
        .map((memberId) => {
          const user = users.find((u) => u._id === memberId);
          return user ? { _id: user._id, name: user.name } : null;
        })
        .filter(Boolean);

      const response = await fetch(`${API_BASE_URL}/projects/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...newProject,
          teamMembers: membersToSend,
          startDate: dayjs(newProject.startDate).format("YYYY-MM-DD"),
          endDate: dayjs(newProject.endDate).format("YYYY-MM-DD"),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể tạo dự án.");
      }
      toast.success("Dự án đã được tạo thành công!");
      handleCloseCreateDialog();
      fetchProjects();
    } catch (err) {
      console.error("Lỗi khi tạo dự án:", err);
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleOpenEditDialog = (project) => {
    setEditProject({
      ...project,
      startDate: project.startDate ? dayjs(project.startDate) : null,
      endDate: project.endDate ? dayjs(project.endDate) : null,
      teamMembers: project.teamMembers
        ? project.teamMembers.map((member) => member._id || member)
        : [],
      sprintId: project.sprintId
        ? project.sprintId.map((sprint) => sprint._id || sprint)
        : [],
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditProject(null);
  };

  const handleEditProjectChange = (e) => {
    const { name, value } = e.target;
    setEditProject((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditMultiSelectChange = (e, fieldName) => {
    const { value } = e.target;
    setEditProject((prev) => ({
      ...prev,
      [fieldName]: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/projects/delete/${projectId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể xóa dự án.");
      }
      toast.success("Dự án đã được xóa thành công!");
      fetchProjects();
    } catch (err) {
      console.error("Lỗi khi xóa dự án:", err);
      toast.error(`Lỗi: ${err.message}`);
    }
  };

  const handleUpdateProject = async () => {
    setLoadingEdit(true);
    try {
      if (!editProject || !editProject._id) {
        throw new Error("Không có dự án nào được chọn để chỉnh sửa.");
      }
      if (!editProject.startDate || !editProject.endDate) {
        toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
        setLoadingEdit(false);
        return;
      }
      if (dayjs(editProject.endDate).isBefore(dayjs(editProject.startDate))) {
        toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.");
        setLoadingEdit(false);
        return;
      }

      const payload = {
        title: editProject.title,
        description: editProject.description,
        startDate: dayjs(editProject.startDate).format("YYYY-MM-DD"),
        endDate: dayjs(editProject.endDate).format("YYYY-MM-DD"),
        teamMembers: editProject.teamMembers,
        sprintId: editProject.sprintId,
      };

      const response = await fetch(
        `${API_BASE_URL}/projects/update/${editProject._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Không thể cập nhật dự án.");
      }
      toast.success("Dự án đã được cập nhật thành công!");
      handleCloseEditDialog();
      fetchProjects();
    } catch (err) {
      console.error("Lỗi khi cập nhật dự án:", err);
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleOpenMembersDialog = (project) => {
    setSelectedProject(project);
    setOpenMembersDialog(true);
  };

  const handleCloseMembersDialog = () => {
    setOpenMembersDialog(false);
    setSelectedProject(null);
  };

  const handleOpenSprintsDialog = (project) => {
    setSelectedProject(project);
    setOpenSprintsDialog(true);
  };

  const handleCloseSprintsDialog = () => {
    setOpenSprintsDialog(false);
    setSelectedProject(null);
  };

  const handleOpenAddMembersDialog = (project) => {
    setSelectedProject(project);
    // Lọc ra những user chưa có trong project
    const availableUsers = users.filter(user => 
      !project.teamMembers.some(member => 
        (member._id || member) === user._id
      )
    );
    setSelectedUsersToAdd([]);
    setOpenAddMembersDialog(true);
  };

  const handleCloseAddMembersDialog = () => {
    setOpenAddMembersDialog(false);
    setSelectedProject(null);
    setSelectedUsersToAdd([]);
  };

  // New function to handle opening add sprints dialog
  const handleOpenAddSprintsDialog = (project) => {
    setSelectedProject(project);
    // Filter out sprints that are already in the project
    setSelectedSprintsToAdd([]);
    setOpenAddSprintsDialog(true);
  };

  // New function to handle closing add sprints dialog
  const handleCloseAddSprintsDialog = () => {
    setOpenAddSprintsDialog(false);
    setSelectedProject(null);
    setSelectedSprintsToAdd([]);
  };

  const handleAddMembersToProject = async () => {
    if (!selectedProject || selectedUsersToAdd.length === 0) {
      toast.error("Vui lòng chọn ít nhất một thành viên để thêm.");
      return;
    }

    setLoadingAddMembers(true);
    try {
      for (const userId of selectedUsersToAdd) {
        await fetch(`${API_BASE_URL}/projects/add-user/${selectedProject._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ userId }),
        });
      }

      toast.success("Thêm thành viên vào dự án thành công!");
      handleCloseAddMembersDialog();
      fetchProjects(); // Refresh projects list
    } catch (err) {
      console.error("Lỗi khi thêm thành viên:", err);
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setLoadingAddMembers(false);
    }
  };

  // New function to handle adding sprints to project
  const handleAddSprintsToProject = async () => {
    if (!selectedProject || selectedSprintsToAdd.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sprint để thêm.");
      return;
    }

    setLoadingAddSprints(true);
    try {
      for (const sprintId of selectedSprintsToAdd) {
        await fetch(`${API_BASE_URL}/projects/add-sprint/${selectedProject._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ sprintId }),
        });
      }

      toast.success("Thêm sprint vào dự án thành công!");
      handleCloseAddSprintsDialog();
      fetchProjects(); // Refresh projects list
    } catch (err) {
      console.error("Lỗi khi thêm sprint:", err);
      toast.error(`Lỗi: ${err.message}`);
    } finally {
      setLoadingAddSprints(false);
    }
  };

  if (loading || loadingDropdownData) {
    return (
      <Box className="projects-loading-container">
        <CircularProgress size={60} thickness={4} className="projects-styled-circular-progress" />
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: 600,
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        className="projects-root"
        sx={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          sx={{
            p: 4,
            borderRadius: "24px",
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
          }}
        >
          <Typography
            variant="h5"
            color="error"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Đã xảy ra lỗi: {error}
          </Typography>
          <Button
            className="projects-styled-button"
            onClick={fetchProjects}
            startIcon={<RefreshIcon />}
            sx={{ mt: 2 }}
          >
            Thử lại
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
      <Box className="projects-root">
        <Paper className="projects-main-container">
          <Box className="projects-header">
            <Typography className="projects-header-title">Quản lý Dự án</Typography>
            <Typography className="projects-header-subtitle">
              Khám phá và tạo những dự án tuyệt vời của bạn
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Button
                className="projects-create-button"
                variant="contained"
                size="large"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleOpenCreateDialog}
              >
                Tạo Dự án Mới
              </Button>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 3, md: 6 }, py: { xs: 4, md: 8 } }}>
            {projects.length === 0 ? (
              <Box className="projects-empty-state">
                <TrendingUpIcon
                  sx={{ fontSize: "4rem", color: "#667eea", mb: 2 }}
                />
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ fontWeight: 700, color: "#2d3748" }}
                >
                  Chưa có dự án nào
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                  Hãy bắt đầu hành trình của bạn bằng cách tạo dự án đầu tiên!
                </Typography>
                <Button
                  className="projects-create-button"
                  variant="contained"
                  size="large"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={handleOpenCreateDialog}
                >
                  Tạo Dự án Đầu Tiên
                </Button>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {projects.map((project) => (
                  <Grid item xs={12} sm={6} lg={4} key={project._id}>
                    <Card className="projects-project-card">
                      <CardContent className="projects-project-card-content">
                        <Box>
                          <Typography className="projects-project-title project-title">
                            <WorkIcon />
                            {project.title}
                          </Typography>

                          <Typography className="projects-project-description">
                            {project.description ||
                              "Không có mô tả cho dự án này."}
                          </Typography>

                          <Box className="projects-date-info">
                            <DateRangeIcon
                              sx={{ fontSize: "1.1rem", color: "#667eea" }}
                            />
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {project.startDate
                                ? new Date(
                                    project.startDate
                                  ).toLocaleDateString("vi-VN")
                                : "N/A"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              đến
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {project.endDate
                                ? new Date(project.endDate).toLocaleDateString(
                                    "vi-VN"
                                  )
                                : "N/A"}
                            </Typography>
                          </Box>

                          <Box className="projects-action-buttons">
                            <Button
                              className="projects-action-button members"
                              startIcon={<GroupIcon />}
                              onClick={() => handleOpenMembersDialog(project)}
                            >
                              Thành viên ({project.teamMembers.length})
                            </Button>
                            <Button
                              className="projects-action-button sprints"
                              startIcon={<SprintIcon />}
                              onClick={() => handleOpenSprintsDialog(project)}
                            >
                              Sprint ({project.sprintId.length})
                            </Button>
                          </Box>
                        </Box>

                        <Box className="projects-project-actions project-actions">
                          <IconButton
                            className="projects-styled-icon-button edit"
                            size="small"
                            onClick={() => handleOpenEditDialog(project)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            className="projects-styled-icon-button delete"
                            size="small"
                            onClick={() => handleDeleteProject(project._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>

        {/* Dialog to Create New Project */}
        <Dialog
          className="projects-styled-dialog"
          open={openCreateDialog}
          onClose={handleCloseCreateDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle className="projects-styled-dialog-title">✨ Tạo Dự án Mới</DialogTitle>
          <DialogContent sx={{ p: 4, py: 10 }}>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{ "& > :not(style)": { my: 3 } }}
            >
              <TextField
                className="projects-styled-text-field"
                fullWidth
                label="Tên Dự án"
                name="title"
                value={newProject.title}
                onChange={handleNewProjectChange}
                required
                placeholder="Nhập tên dự án của bạn..."
              />
              <TextField
                className="projects-styled-text-field"
                fullWidth
                label="Mô tả"
                name="description"
                multiline
                rows={4}
                value={newProject.description}
                onChange={handleNewProjectChange}
                placeholder="Mô tả chi tiết về dự án..."
              />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Ngày bắt đầu"
                    value={newProject.startDate}
                    onChange={(newValue) =>
                      setNewProject({ ...newProject, startDate: newValue })
                    }
                    renderInput={(params) => (
                      <TextField className="projects-styled-text-field" {...params} fullWidth required />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Ngày kết thúc"
                    value={newProject.endDate}
                    onChange={(newValue) =>
                      setNewProject({ ...newProject, endDate: newValue })
                    }
                    minDate={dayjs(newProject.startDate)}
                    renderInput={(params) => (
                      <TextField className="projects-styled-text-field" {...params} fullWidth required />
                    )}
                  />
                </Grid>
              </Grid>
              <FormControl className="projects-styled-form-control" fullWidth>
                <InputLabel id="team-members-label">Thành viên nhóm</InputLabel>
                <Select
                  labelId="team-members-label"
                  multiple
                  value={newProject.teamMembers}
                  onChange={(e) =>
                    handleNewProjectChange({
                      target: { name: "teamMembers", value: e.target.value },
                    })
                  }
                  input={<OutlinedInput label="Thành viên nhóm" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const user = users.find((u) => u._id === value);
                        return user ? (
                          <Chip
                            className="projects-styled-chip"
                            key={value}
                            label={user.name}
                            size="small"
                          />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <GroupIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button className="projects-styled-button" onClick={handleCloseCreateDialog} variant="outlined">
              Hủy bỏ
            </Button>
            <Button
              className="projects-create-button"
              onClick={handleCreateProject}
              variant="contained"
              disabled={loadingCreate}
              startIcon={
                loadingCreate ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddCircleOutlineIcon />
                )
              }
            >
              {loadingCreate ? "Đang tạo..." : "Tạo Dự án"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog to Edit Project */}
        <Dialog
          className="projects-styled-dialog"
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle className="projects-styled-dialog-title">✏️ Chỉnh sửa Dự án</DialogTitle>
          <DialogContent sx={{ p: 4 }}>
            {editProject && (
              <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ "& > :not(style)": { mb: 3 } }}
              >
                <TextField
                  className="projects-styled-text-field"
                  fullWidth
                  label="Tên Dự án"
                  name="title"
                  value={editProject.title}
                  onChange={handleEditProjectChange}
                  required
                />
                <TextField
                  className="projects-styled-text-field"
                  fullWidth
                  label="Mô tả"
                  name="description"
                  multiline
                  rows={4}
                  value={editProject.description}
                  onChange={handleEditProjectChange}
                />
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Ngày bắt đầu"
                      value={editProject.startDate}
                      onChange={(newValue) =>
                        setEditProject({ ...editProject, startDate: newValue })
                      }
                      renderInput={(params) => (
                        <TextField className="projects-styled-text-field" {...params} fullWidth required />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Ngày kết thúc"
                      value={editProject.endDate}
                      onChange={(newValue) =>
                        setEditProject({ ...editProject, endDate: newValue })
                      }
                      minDate={dayjs(editProject.startDate)}
                      renderInput={(params) => (
                        <TextField className="projects-styled-text-field" {...params} fullWidth required />
                      )}
                    />
                  </Grid>
                </Grid>
                <FormControl className="projects-styled-form-control" fullWidth>
                  <InputLabel>Thành viên nhóm</InputLabel>
                  <Select
                    multiple
                    value={editProject.teamMembers}
                    onChange={(e) =>
                      handleEditMultiSelectChange(e, "teamMembers")
                    }
                    input={<OutlinedInput label="Thành viên nhóm" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selected.map((value) => {
                          const user = users.find((u) => u._id === value);
                          return user ? (
                            <Chip
                              className="projects-styled-chip"
                              key={value}
                              label={user.name}
                              size="small"
                            />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {users.map((user) => (
                      <MenuItem key={user._id} value={user._id}>
                        <GroupIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl className="projects-styled-form-control" fullWidth>
                  <InputLabel>Sprints</InputLabel>
                  <Select
                    multiple
                    value={editProject.sprintId}
                    onChange={(e) => handleEditMultiSelectChange(e, "sprintId")}
                    input={<OutlinedInput label="Sprints" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {selected.map((value) => {
                          const sprint = sprints.find((s) => s._id === value);
                          return sprint ? (
                            <Chip
                              className="projects-styled-chip"
                              key={value}
                              label={sprint.title}
                              size="small"
                            />
                          ) : null;
                        })}
                      </Box>
                    )}
                  >
                    {sprints.map((sprint) => (
                      <MenuItem key={sprint._id} value={sprint._id}>
                        <SprintIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                        {sprint.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button className="projects-styled-button" onClick={handleCloseEditDialog} variant="outlined">
              Hủy bỏ
            </Button>
            <Button
              className="projects-styled-button projects-update-button"
              onClick={handleUpdateProject}
              variant="contained"
              disabled={loadingEdit}
              startIcon={
                loadingEdit ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <EditIcon />
                )
              }
            >
              {loadingEdit ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog danh sách thành viên */}
        <Dialog
          className="projects-styled-dialog"
          open={openMembersDialog}
          onClose={handleCloseMembersDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className="projects-styled-dialog-title">👥 Danh sách Thành viên</DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {selectedProject &&
            selectedProject.teamMembers &&
            selectedProject.teamMembers.length > 0 ? (
              <List sx={{ p: 0 }}>
                {selectedProject.teamMembers.map((member, index) => {
                  const user = users.find(
                    (u) => u._id === (member._id || member)
                  );
                  return user ? (
                    <React.Fragment key={user._id}>
                      <ListItem sx={{ py: 2, px: 3 }}>
                        <Avatar
                          sx={{
                            mr: 2,
                            background:
                              "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                            fontWeight: 700,
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                            >
                              {user.name}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{ color: "#64748b", fontSize: "0.9rem" }}
                            >
                              {user.email}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < selectedProject.teamMembers.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ) : null;
                })}
              </List>
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <PeopleIcon
                  sx={{ fontSize: "3rem", color: "#667eea", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Chưa có thành viên nào trong dự án này
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              className="projects-styled-button"
              onClick={() => handleOpenAddMembersDialog(selectedProject)}
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
            >
              Thêm thành viên
            </Button>
            <Button
              className="projects-styled-button"
              onClick={() => handleOpenSprintsDialog(selectedProject)}
              variant="outlined"
              startIcon={<SprintIcon />}
            >
              Xem Sprint
            </Button>
            <Button
              className="projects-styled-button"
              onClick={handleCloseMembersDialog}
              variant="contained"
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog thêm thành viên */}
        <Dialog
          className="projects-styled-dialog"
          open={openAddMembersDialog}
          onClose={handleCloseAddMembersDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className="projects-styled-dialog-title">➕ Thêm Thành viên</DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <FormControl className="projects-styled-form-control" fullWidth>
              <InputLabel>Chọn thành viên để thêm</InputLabel>
              <Select
                multiple
                value={selectedUsersToAdd}
                onChange={(e) => setSelectedUsersToAdd(e.target.value)}
                input={<OutlinedInput label="Chọn thành viên để thêm" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selected.map((value) => {
                      const user = users.find((u) => u._id === value);
                      return user ? (
                        <Chip
                          className="projects-styled-chip"
                          key={value}
                          label={user.name}
                          size="small"
                        />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {users
                  .filter(user => 
                    selectedProject && !selectedProject.teamMembers.some(member => 
                      (member._id || member) === user._id
                    )
                  )
                  .map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <GroupIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                      {user.name} ({user.email})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              className="projects-styled-button"
              onClick={handleCloseAddMembersDialog}
              variant="outlined"
            >
              Hủy bỏ
            </Button>
            <Button
              className="projects-create-button"
              onClick={handleAddMembersToProject}
              variant="contained"
              disabled={loadingAddMembers || selectedUsersToAdd.length === 0}
              startIcon={
                loadingAddMembers ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddCircleOutlineIcon />
                )
              }
            >
              {loadingAddMembers ? "Đang thêm..." : "Thêm thành viên"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog danh sách Sprints */}
        <Dialog
          className="projects-styled-dialog"
          open={openSprintsDialog}
          onClose={handleCloseSprintsDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className="projects-styled-dialog-title">🚀 Danh sách Sprints</DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            {selectedProject &&
            selectedProject.sprintId &&
            selectedProject.sprintId.length > 0 ? (
              <List sx={{ p: 0 }}>
                {selectedProject.sprintId.map((sprintId, index) => {
                  const sprint = sprints.find(
                    (s) => s._id === (sprintId._id || sprintId)
                  );
                  return sprint ? (
                    <React.Fragment key={sprint._id}>
                      <ListItem sx={{ py: 2, px: 3 }}>
                        <Avatar
                          sx={{
                            mr: 2,
                            background:
                              "linear-gradient(45deg, #ef4444 30%, #dc2626 90%)",
                            fontWeight: 700,
                          }}
                        >
                          <SprintIcon />
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ fontWeight: 600, fontSize: "1.1rem" }}
                            >
                              {sprint.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              sx={{ color: "#64748b", fontSize: "0.9rem" }}
                            >
                              {new Date(sprint.startDate).toLocaleDateString(
                                "vi-VN"
                              )}{" "}
                              -{" "}
                              {new Date(sprint.endDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < selectedProject.sprintId.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ) : null;
                })}
              </List>
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <SprintIcon
                  sx={{ fontSize: "3rem", color: "#ef4444", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Chưa có sprint nào trong dự án này
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              className="projects-styled-button"
              onClick={() => handleOpenAddSprintsDialog(selectedProject)}
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
            >
              Thêm Sprint
            </Button>
            <Button
              className="projects-styled-button"
              onClick={handleCloseSprintsDialog}
              variant="contained"
            >
              Đóng
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog thêm Sprint */}
        <Dialog
          className="projects-styled-dialog"
          open={openAddSprintsDialog}
          onClose={handleCloseAddSprintsDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className="projects-styled-dialog-title">🚀 Thêm Sprint</DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <FormControl className="projects-styled-form-control" fullWidth>
              <InputLabel>Chọn sprint để thêm</InputLabel>
              <Select
                multiple
                value={selectedSprintsToAdd}
                onChange={(e) => setSelectedSprintsToAdd(e.target.value)}
                input={<OutlinedInput label="Chọn sprint để thêm" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selected.map((value) => {
                      const sprint = sprints.find((s) => s._id === value);
                      return sprint ? (
                        <Chip
                          className="projects-styled-chip"
                          key={value}
                          label={sprint.title}
                          size="small"
                        />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {sprints
                  .filter(sprint => 
                    selectedProject && !selectedProject.sprintId.some(projectSprint => 
                      (projectSprint._id || projectSprint) === sprint._id
                    )
                  )
                  .map((sprint) => (
                    <MenuItem key={sprint._id} value={sprint._id}>
                      <SprintIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                      {sprint.title} ({new Date(sprint.startDate).toLocaleDateString("vi-VN")} - {new Date(sprint.endDate).toLocaleDateString("vi-VN")})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              className="projects-styled-button"
              onClick={handleCloseAddSprintsDialog}
              variant="outlined"
            >
              Hủy bỏ
            </Button>
            <Button
              className="projects-create-button"
              onClick={handleAddSprintsToProject}
              variant="contained"
              disabled={loadingAddSprints || selectedSprintsToAdd.length === 0}
              startIcon={
                loadingAddSprints ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <AddCircleOutlineIcon />
                )
              }
            >
              {loadingAddSprints ? "Đang thêm..." : "Thêm Sprint"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default ProjectsPage;