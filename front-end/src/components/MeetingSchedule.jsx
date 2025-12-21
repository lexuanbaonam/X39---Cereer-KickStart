import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import './MeetingSchedule.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`meeting-tabpanel-${index}`}
      aria-labelledby={`meeting-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function MeetingSchedule() {
  const [tabIndex, setTabIndex] = useState(0);
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    participants: '',
  });
  const [joinData, setJoinData] = useState({
    meetingId: '',
    password: '',
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({ ...prev, [name]: value }));
  };

  const handleJoinChange = (e) => {
    const { name, value } = e.target;
    setJoinData(prev => ({ ...prev, [name]: value }));
  };

  const submitRequest = (e) => {
    e.preventDefault();
    // Xử lý gửi yêu cầu họp tại đây
    console.log('Gửi yêu cầu họp:', requestData);
  };

  const submitJoin = (e) => {
    e.preventDefault();
    // Xử lý tham gia họp
    console.log('Tham gia họp với:', joinData);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="Meeting schedule tabs"
        centered
        textColor="inherit"
        indicatorColor="primary"
      >
        <Tab label="Xem Lịch Họp" />
        <Tab label="Tham Gia Họp" />
        <Tab label="Gửi Yêu Cầu Họp" />
      </Tabs>

      {/* Tab 1: Xem Lịch Họp */}
      <TabPanel value={tabIndex} index={0}>
        <Typography variant="h5" fontWeight={700} mb={2}>
          Lịch Họp Trực Tuyến
        </Typography>
        <Box className="meeting-list">
        </Box>
      </TabPanel>

      {/* Tab 2: Tham Gia Họp */}
      <TabPanel value={tabIndex} index={1}>
        <form onSubmit={submitJoin} className="join-form">
          <Typography variant="h5" fontWeight={700} mb={3}>
            Tham Gia Họp
          </Typography>
          <TextField
            label="Meeting ID"
            variant="outlined"
            name="meetingId"
            value={joinData.meetingId}
            onChange={handleJoinChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Mật khẩu"
            type="password"
            variant="outlined"
            name="password"
            value={joinData.password}
            onChange={handleJoinChange}
            fullWidth
            required
            margin="normal"
          />
          <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            Tham Gia
          </Button>
        </form>
      </TabPanel>

      {/* Tab 3: Gửi Yêu Cầu Họp */}
      <TabPanel value={tabIndex} index={2}>
        <form onSubmit={submitRequest} className="request-form">
          <Typography variant="h5" fontWeight={700} mb={3}>
            Gửi Yêu Cầu Họp Trực Tuyến
          </Typography>

          <Typography fontWeight={600} mb={1}>
            Tiêu đề cuộc họp:
          </Typography>
          <TextField
            name="title"
            value={requestData.title}
            onChange={handleRequestChange}
            placeholder="Nhập tiêu đề cuộc họp"
            fullWidth
            required
            margin="normal"
          />

          <Typography fontWeight={600} mb={1} mt={2}>
            Mô tả nội dung:
          </Typography>
          <TextField
            name="description"
            value={requestData.description}
            onChange={handleRequestChange}
            placeholder="Mô tả chi tiết nội dung cuộc họp"
            fullWidth
            multiline
            minRows={4}
            margin="normal"
          />

          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography fontWeight={600} mb={1}>
                Ngày họp:
              </Typography>
              <TextField
                name="date"
                type="date"
                value={requestData.date}
                onChange={handleRequestChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography fontWeight={600} mb={1}>
                Giờ họp:
              </Typography>
              <TextField
                name="time"
                type="time"
                value={requestData.time}
                onChange={handleRequestChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: '1 1 200px' }}>
              <Typography fontWeight={600} mb={1}>
                Thời lượng:
              </Typography>
              <TextField
                select
                name="duration"
                value={requestData.duration}
                onChange={handleRequestChange}
                fullWidth
                required
              >
                <MenuItem value="">Chọn thời lượng</MenuItem>
                <MenuItem value="15">15 phút</MenuItem>
                <MenuItem value="30">30 phút</MenuItem>
                <MenuItem value="45">45 phút</MenuItem>
                <MenuItem value="60">1 giờ</MenuItem>
                <MenuItem value="90">1 giờ 30 phút</MenuItem>
                <MenuItem value="120">2 giờ</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ flex: '1 1 200px' }}>
              <Typography fontWeight={600} mb={1}>
                Số người tham gia:
              </Typography>
              <TextField
                name="participants"
                type="number"
                inputProps={{ min: 1 }}
                placeholder="VD: 10"
                value={requestData.participants}
                onChange={handleRequestChange}
                fullWidth
                required
              />
            </Box>
          </Box>

          <Button variant="contained" type="submit" sx={{ mt: 3 }}>
            Gửi Yêu Cầu
          </Button>
        </form>
      </TabPanel>
    </Box>
  );
}
