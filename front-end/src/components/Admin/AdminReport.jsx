import React, { useState, useEffect } from 'react';
import {
  Accordion, AccordionSummary, AccordionDetails,
  Typography, Box, Paper, Table, TableHead, TableBody, TableRow, TableCell, List, ListItemButton, ListItemText, Divider, CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';

const ReportContainer = styled(Box)({
  display: 'flex',
  gap: '24px',
  padding: '24px',
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
});

const Sidebar = styled(Box)({
  flex: '0 0 280px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  borderRadius: '12px',
  backgroundColor: '#fff',
  overflow: 'hidden',
});

const ReportContent = styled(Box)({
  flex: '1',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  borderRadius: '12px',
  backgroundColor: '#fff',
  padding: '24px',
});

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: '#424242',
  color: '#fff',
  '& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root': {
    color: '#fff',
  },
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: '#e0e0e0',
    
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  '&:hover': {
    backgroundColor: '#fafafa',
  },
}));

export default function AdminReport({ authToken }) {
  const [selected, setSelected] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseURL = 'https://back-end-hk2p.onrender.com/api/reports';
  const endpoints = {
    overview: `${baseURL}/overview`,
    performance: `${baseURL}/performance`,
  };

  const handleSelect = (key) => () => setSelected(key);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      try {
        const res = await fetch(endpoints[selected], {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || `Error ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (authToken) fetchReport();
  }, [selected, authToken]);

  const renderOverview = () => {
    if (!data?.overview) return null;
    const { employees, tasks, projects, sprints } = data.overview;
    return (
      <Paper elevation={0} sx={{ p: 2, borderRadius: '8px' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Báo Cáo Tổng Quan
        </Typography>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Số lượng</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hoạt động/Hoàn thành</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tỷ lệ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Nhân viên</TableCell>
              <TableCell>{employees.total}</TableCell>
              <TableCell>{employees.active}</TableCell>
              <TableCell>{employees.utilizationRate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Công việc</TableCell>
              <TableCell>{tasks.total}</TableCell>
              <TableCell>{tasks.completed}</TableCell>
              <TableCell>{tasks.completionRate}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Dự án</TableCell>
              <TableCell>{projects.total}</TableCell>
              <TableCell>{projects.active}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Sprint</TableCell>
              <TableCell>{sprints.total}</TableCell>
              <TableCell>{sprints.active}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    );
  };

  const renderPerformance = () => {
    const perfList = data?.performance || [];
    const summary = data?.summary || {};
    return (
      <Paper elevation={0} sx={{ p: 2, borderRadius: '8px' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Phân Tích Hiệu Suất
        </Typography>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tổng CP</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hoàn thành</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Đúng hạn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Trễ hạn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tỷ lệ hoàn thành</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tỷ lệ đúng hạn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Điểm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {perfList.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.personalEmail}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.roleTag}</TableCell>
                <TableCell>{item.totalTasks}</TableCell>
                <TableCell>{item.completedTasks}</TableCell>
                <TableCell>{item.onTimeTasks}</TableCell>
                <TableCell>{item.overdueTasks}</TableCell>
                <TableCell>{item.completionRate}%</TableCell>
                <TableCell>{item.onTimeRate}%</TableCell>
                <TableCell>{item.performanceScore}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box mt={4} sx={{ backgroundColor: '#fafafa', p: 2, borderRadius: '8px' }}>
          <Typography variant="subtitle1">Tổng nhân viên: {summary.totalEmployees}</Typography>
          <Typography variant="subtitle1">Tỷ lệ hoàn thành TB: {summary.averageCompletionRate}%</Typography>
          <Typography variant="subtitle1">Tỷ lệ đúng hạn TB: {summary.averageOnTimeRate}%</Typography>
        </Box>
      </Paper>
    );
  };

  const renderSelected = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) return <Typography color="error">{error}</Typography>;
    switch (selected) {
      case 'overview': return renderOverview();
      case 'performance': return renderPerformance();
      default: return null;
    }
  };

  return (
    <ReportContainer>
      <Sidebar>
        <Accordion defaultExpanded>
          <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Chức năng</Typography>
          </StyledAccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List disablePadding>
              {['overview', 'performance'].map((key, idx) => (
                <React.Fragment key={key}>
                  <StyledListItemButton selected={selected === key} onClick={handleSelect(key)}>
                    <ListItemText primary={{ overview: 'Báo cáo tổng quan', performance: 'Phân tích hiệu suất' }[key]} />
                  </StyledListItemButton>
                  {idx < 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      </Sidebar>
      <ReportContent>{renderSelected()}</ReportContent>
    </ReportContainer>
  );
}