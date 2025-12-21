import React, { useState } from "react";
import "./ProjectPage.css";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import EventIcon from "@mui/icons-material/Event";
import EventNoteIcon from "@mui/icons-material/EventNote";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
export const availableMembers = []; 
export const availableSprints = []; 
export default function ProjectPage() {
  const [projectList, setProjectList] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editProjectId, setEditProjectId] = useState(null);
  const [openMembers, setOpenMembers] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [openSprints, setOpenSprints] = useState(false);
  const [newSprintName, setNewSprintName] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const initialFormState = {
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    sprints: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setOpenCreate(true);
  };
  const handleCloseCreate = () => setOpenCreate(false);

  const handleOpenEdit = (project) => {
    setEditProjectId(project.id);
    setFormData({
      title: project.title,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      sprints: project.sprints.join(", "),
    });
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditProjectId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateSubmit = () => {
    if (!formData.title.trim()) {
      alert("Tên dự án không được để trống!");
      return;
    }
    const newProject = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      members: [],
      sprints: formData.sprints
        ? formData.sprints.split(",").map((s) => s.trim())
        : [],
      tasks: [],
    };
    setProjectList((prev) => [newProject, ...prev]);
    setOpenCreate(false);
  };

  const handleEditSubmit = () => {
    if (!formData.title.trim()) {
      alert("Tên dự án không được để trống!");
      return;
    }
    setProjectList((prev) =>
      prev.map((p) =>
        p.id === editProjectId
          ? {
              ...p,
              title: formData.title,
              description: formData.description,
              startDate: formData.startDate,
              endDate: formData.endDate,
              sprints: formData.sprints
                ? formData.sprints.split(",").map((s) => s.trim())
                : [],
            }
          : p
      )
    );
    setOpenEdit(false);
    setEditProjectId(null);
  };

  const handleDelete = (project) => {
    if (
      window.confirm(`Bạn có chắc muốn xóa dự án "${project.title}" không?`)
    ) {
      setProjectList((prev) => prev.filter((p) => p.id !== project.id));
    }
  };

  const handleOpenMembers = (projectId) => {
    setSelectedProjectId(projectId);
    setAddingMember(false);
    setOpenMembers(true);
  };
  const handleCloseMembers = () => {
    setOpenMembers(false);
    setAddingMember(false);
    setSelectedProjectId(null);
  };

  const handleAddMember = (member) => {
    setProjectList((prev) =>
      prev.map((p) =>
        p.id === selectedProjectId && !p.members.includes(member)
          ? { ...p, members: [...p.members, member] }
          : p
      )
    );
  };

  const handleOpenSprints = (projectId) => {
    setSelectedProjectId(projectId);
    setNewSprintName("");
    setOpenSprints(true);
  };
  const handleCloseSprints = () => {
    setOpenSprints(false);
    setSelectedProjectId(null);
    setNewSprintName("");
  };

  const handleAddSprint = () => {
    const sprintName = newSprintName.trim();
    if (!sprintName) {
      alert("Vui lòng nhập tên sprint");
      return;
    }
    setProjectList((prev) =>
      prev.map((p) =>
        p.id === selectedProjectId && !p.sprints.includes(sprintName)
          ? { ...p, sprints: [...p.sprints, sprintName] }
          : p
      )
    );
    setNewSprintName("");
  };

  return (
    <Box className="project-page-root" sx={{ p: 4, bgcolor: "#fff" }}>
      <Paper
        elevation={3}
        className="project-header"
        sx={{
          bgcolor: "#000",
          color: "#fff",
          p: 3,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={1}>
          Quản lý Dự án
        </Typography>
        <Typography variant="body2" mb={2}>
          Xem và tạo các dự án của bạn
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{
            textTransform: "none",
            bgcolor: "#fff",
            color: "#000",
            "&:hover": { bgcolor: "#f0f0f0" },
          }}
          onClick={handleOpenCreate}
        >
          + Tạo Dự án Mới
        </Button>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {projectList.length === 0 && (
            <Typography
              variant="body1"
              sx={{ m: 2, textAlign: "center", width: "100%", color: "#888" }}
            >
              Chưa có dự án nào. Hãy tạo dự án mới nhé!
            </Typography>
          )}
          {projectList.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Paper
                elevation={3}
                className="project-card"
                sx={{
                  borderRadius: 3,
                  bgcolor: "#fff",
                  color: "#000",
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0px 0px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Box
                  className="project-card-header"
                  sx={{
                    bgcolor: "#000",
                    color: "#fff",
                    p: 2,
                    borderRadius: "12px 12px 0 0",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minHeight: 48,
                  }}
                >
                  <SettingsIcon fontSize="small" sx={{ color: "#fff" }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {project.title}
                  </Typography>
                </Box>

                <Box
                  className="project-card-body"
                  sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {project.description}
                  </Typography>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "text.secondary",
                      }}
                    >
                      <EventIcon fontSize="small" /> Bắt đầu
                    </Typography>
                    <Typography fontWeight={600}>{project.startDate}</Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: "text.secondary",
                      }}
                    >
                      <EventNoteIcon fontSize="small" /> Kết thúc
                    </Typography>
                    <Typography fontWeight={600}>{project.endDate}</Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <GroupIcon fontSize="small" />
                    <Typography
                      fontWeight={600}
                      sx={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => handleOpenMembers(project.id)}
                      title="Quản lý Thành viên"
                    >
                      Thành viên ({project.members.length})
                    </Typography>
                    {project.members.map((m, i) => (
                      <Chip
                        key={i}
                        label={m}
                        size="small"
                        sx={{ bgcolor: "#000", color: "#fff" }}
                      />
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                      flexWrap: "wrap",
                      cursor: "pointer",
                      textDecoration: "underline",
                      userSelect: "none",
                    }}
                    onClick={() => handleOpenSprints(project.id)}
                    title="Quản lý Sprints"
                  >
                    <SettingsIcon fontSize="small" />
                    <Typography fontWeight={600} component="span">
                      Sprints ({project.sprints.length})
                    </Typography>
                    {project.sprints.map((sprint, i) => (
                      <Chip
                        key={i}
                        label={sprint}
                        size="small"
                        sx={{
                          backgroundColor: "#eee",
                          color: "#000",
                          marginRight: 0.5,
                          marginBottom: 0.5,
                        }}
                      />
                    ))}
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    <TaskAltIcon fontSize="small" />
                    <Typography fontWeight={600}>
                      Tasks ({project.tasks.length})
                    </Typography>
                    {project.tasks.map((task, i) => (
                      <Chip
                        key={i}
                        label={task}
                        size="small"
                        sx={{
                          backgroundColor: "#eee",
                          color: "#000",
                          marginRight: 0.5,
                          marginBottom: 0.5,
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box
                  className="project-card-footer"
                  sx={{
                    p: 1,
                    minHeight: 40,
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    borderTop: "1px solid #ccc",
                  }}
                >
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={() => handleOpenEdit(project)}
                    sx={{ color: "#000" }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete"
                    size="small"
                    sx={{ color: "#000" }}
                    onClick={() => handleDelete(project)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                  <IconButton
                    aria-label="view"
                    size="small"
                    sx={{ color: "#000" }}
                    onClick={() => alert(`Xem chi tiết dự án: ${project.title}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <DialogTitle>Tạo Dự án Mới</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Tên dự án"
            name="title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Mô tả"
            name="description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Ngày bắt đầu"
            name="startDate"
            fullWidth
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Ngày kết thúc"
            name="endDate"
            fullWidth
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Sprint (cách nhau dấu phẩy)"
            name="sprints"
            fullWidth
            variant="outlined"
            value={formData.sprints}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreate}>Hủy</Button>
          <Button variant="contained" onClick={handleCreateSubmit}>
            Tạo
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Chỉnh sửa Dự án</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Tên dự án"
            name="title"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Mô tả"
            name="description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Ngày bắt đầu"
            name="startDate"
            fullWidth
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.startDate}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Ngày kết thúc"
            name="endDate"
            fullWidth
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.endDate}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Sprint (cách nhau dấu phẩy)"
            name="sprints"
            fullWidth
            variant="outlined"
            value={formData.sprints}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Hủy</Button>
          <Button variant="contained" onClick={handleEditSubmit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openMembers}
        onClose={handleCloseMembers}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Quản lý Thành viên</DialogTitle>
        <DialogContent dividers>
          {!addingMember ? (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Thành viên hiện có:
              </Typography>
              {projectList.find((p) => p.id === selectedProjectId)?.members
                .length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Chưa có thành viên nào
                </Typography>
              )}
              {projectList
                .find((p) => p.id === selectedProjectId)
                ?.members.map((mem, i) => (
                  <Chip
                    key={i}
                    label={mem}
                    size="small"
                    sx={{ bgcolor: "#000", color: "#fff", mr: 0.5, mb: 0.5 }}
                  />
                ))}
            </>
          ) : (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Chọn thành viên để thêm:
              </Typography>
              {availableMembers.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Danh sách thành viên 
                </Typography>
              ) : (
                availableMembers.map((member, i) => {
                  const isAlreadyAdded = projectList
                    .find((p) => p.id === selectedProjectId)
                    ?.members.includes(member);
                  return (
                    <Button
                      key={i}
                      variant={isAlreadyAdded ? "outlined" : "contained"}
                      color={isAlreadyAdded ? "inherit" : "primary"}
                      disabled={isAlreadyAdded}
                      fullWidth
                      sx={{ mb: 1, textTransform: "none" }}
                      onClick={() => {
                        if (!isAlreadyAdded) {
                          handleAddMember(member);
                        }
                      }}
                    >
                      {member} {isAlreadyAdded ? "(Đã có)" : ""}
                    </Button>
                  );
                })
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          {addingMember ? (
            <Button onClick={() => setAddingMember(false)}>Quay lại</Button>
          ) : (
            <Button onClick={handleCloseMembers}>Đóng</Button>
          )}
          {!addingMember && (
            <Button variant="contained" onClick={() => setAddingMember(true)}>
              Thêm thành viên
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={openSprints}
        onClose={handleCloseSprints}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Quản lý Sprints</DialogTitle>
        <DialogContent dividers>
          <TextField
            margin="dense"
            label="Nhập tên Sprint"
            fullWidth
            variant="outlined"
            value={newSprintName}
            onChange={(e) => setNewSprintName(e.target.value)}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sprints hiện có:
            </Typography>
            {projectList.find((p) => p.id === selectedProjectId)?.sprints.length ===
              0 && (
              <Typography variant="body2" color="text.secondary">
                Chưa có sprint nào
              </Typography>
            )}
            {projectList
              .find((p) => p.id === selectedProjectId)
              ?.sprints.map((sp, i) => (
                <Chip
                  key={i}
                  label={sp}
                  size="small"
                  sx={{ backgroundColor: "#eee", color: "#000", mr: 0.5, mb: 0.5 }}
                />
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSprints}>Đóng</Button>
          <Button variant="contained" onClick={handleAddSprint}>
            Thêm sprint
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
