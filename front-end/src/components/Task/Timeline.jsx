import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Avatar, IconButton } from '@mui/material';
import { ArrowDropDown, Add } from '@mui/icons-material'; // Example icons
import './Timeline.css'; // This will need extensive changes

// Dummy data (replace with actual data fetching in a real app)
const dummyProjectData = [
  {
    id: 'phase-ux',
    name: 'UX Research',
    members: ['/path/to/avatar1.jpg', '/path/to/avatar2.jpg'],
    tasks: [
      { id: 'task-ux-1', name: 'Profile', startDay: 4, endDay: 7, progress: 48, color: '#6a5acd' },
      { id: 'task-ux-2', name: 'Login', startDay: 5, endDay: 8, progress: 48, color: '#4682b4' },
      { id: 'task-ux-3', name: 'Menu', startDay: 10, endDay: 13, progress: 54, color: '#32cd32' },
      { id: 'task-ux-4', name: 'Settings', startDay: 15, endDay: 18, progress: 39, color: '#1e90ff' },
    ],
  },
  {
    id: 'phase-design',
    name: 'Design Phase',
    members: ['/path/to/avatar3.jpg', '/path/to/avatar4.jpg'],
    tasks: [
      { id: 'task-design-1', name: 'Services', startDay: 12, endDay: 15, progress: 54, color: '#ffa500' },
      { id: 'task-design-2', name: 'Testimonials', startDay: 9, endDay: 12, progress: 69, color: '#8a2be2' },
      { id: 'task-design-3', name: 'Homepage', startDay: 16, endDay: 19, progress: 48, color: '#20b2aa' },
      { id: 'task-design-4', name: 'Our Portfolio', startDay: 11, endDay: 14, progress: 63, color: '#5f9ea0' },
    ],
  },
  {
    id: 'phase-dev',
    name: 'Development',
    members: ['/path/to/avatar5.jpg', '/path/to/avatar6.jpg'],
    tasks: [
      { id: 'task-dev-1', name: 'Profile', startDay: 6, endDay: 9, progress: 48, color: '#6a5acd' },
      { id: 'task-dev-2', name: 'Services', startDay: 14, endDay: 17, progress: 54, color: '#ffa500' },
    ],
  },
];

// Helper to get total days for timeline width calculation
const getMaxDay = (data) => {
  let maxDay = 0;
  data.forEach(phase => {
    phase.tasks.forEach(task => {
      if (task.endDay > maxDay) {
        maxDay = task.endDay;
      }
    });
  });
  return maxDay;
};

const Timeline = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const totalDays = getMaxDay(dummyProjectData) + 5; // Add some buffer days

  // Function to calculate task bar position and width
  const getTaskStyle = (task) => {
    const dayWidth = 50; // pixels per day, adjust as needed
    const left = (task.startDay - 1) * dayWidth; // startDay 1 corresponds to first column
    const width = (task.endDay - task.startDay + 1) * dayWidth;
    return {
      left: `${left}px`,
      width: `${width}px`,
      backgroundColor: task.color,
    };
  };

  const handleTaskClick = (event) => {
    // Example: Show popup at click position
    setShowPopup(true);
    setPopupPosition({ top: event.clientY, left: event.clientX });
  };

  return (
    <Box className="timeline-container"> {/* Renamed from 'container' to avoid conflict if other containers exist */}
      {/* Header Section */}
      <Box className="timeline-header">
        <Typography variant="h5" sx={{ flexGrow: 1 }}>Timeline</Typography>
        <Button variant="contained" sx={{ mr: 1 }}>Today</Button>
        <Button variant="outlined" startIcon={<ArrowDropDown />}>June, 20.2022</Button>
        <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
          <Button variant="contained" startIcon={<Add />} sx={{ mr: 1 }}>Invite</Button>
          <Avatar alt="Member 1" src="/path/to/avatar_a.jpg" sx={{ width: 24, height: 24, ml: -1 }} />
          <Avatar alt="Member 2" src="/path/to/avatar_b.jpg" sx={{ width: 24, height: 24, ml: -1 }} />
          <Typography sx={{ ml: 1, color: '#666' }}>+5</Typography>
        </Box>
      </Box>

      {/* Main Timeline Content */}
      <Box className="timeline-content-area">
        {/* Left Sidebar for Categories */}
        <Box className="timeline-categories">
          {dummyProjectData.map(phase => (
            <Box key={phase.id} className="timeline-category-item">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton size="small"><Add /></IconButton> {/* Or an expand/collapse icon */}
                <Typography variant="body1">{phase.name}</Typography>
              </Box>
              {phase.name === 'Design Phase' && ( // Example for nested structure
                <Box sx={{ ml: 3 }}>
                  <Typography variant="body2">Build Wireframe</Typography>
                  <Typography variant="body2">User Interface D.</Typography>
                </Box>
              )}
               {phase.name === 'Development' && (
                <Box sx={{ ml: 3 }}>
                  <Typography variant="body2">Back-End Dev.</Typography>
                  <Typography variant="body2">Front-End Dev.</Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', mt: 1 }}>
                {phase.members.map((member, index) => (
                  <Avatar key={index} src={member} sx={{ width: 20, height: 20, mr: 0.5 }} />
                ))}
              </Box>
              <IconButton size="small" sx={{ position: 'absolute', right: 5, top: '50%', transform: 'translateY(-50%)' }}>...</IconButton>
            </Box>
          ))}
        </Box>

        {/* Right Timeline Grid */}
        <Box className="timeline-grid">
          {/* Day Headers */}
          <Box className="timeline-day-headers">
            {Array.from({ length: totalDays }).map((_, i) => (
              <Typography key={`day-${i}`} className="day-header">S {String(i + 1).padStart(2, '0')}</Typography>
            ))}
          </Box>

          {/* Task Rows */} 
          {dummyProjectData.map(phase => (
            <Box key={`row-${phase.id}`} className="timeline-task-row">
              {phase.tasks.map(task => (
                <Box
                  key={task.id}
                  className="timeline-task-bar"
                  sx={{ ...getTaskStyle(task), cursor: 'pointer' }}
                  onClick={handleTaskClick}
                >
                  <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>{task.name}</Typography>
                  <Typography variant="caption" sx={{ color: 'white', ml: 1 }}>{task.progress}%</Typography>
                  <ArrowDropDown sx={{ color: 'white', ml: 'auto' }} /> {/* Example icon */}
                </Box>
              ))}
            </Box>


          ))}
        </Box>
      </Box>

      {/* Complete Task Pop-up (simplified) */}
      {showPopup && (
        <Box
          className="complete-task-popup"
          sx={{ top: popupPosition.top, left: popupPosition.left }}
        >
          <Typography variant="h6">Complete Task</Typography>
          {/* Chart would go here, e.g., <LineChart data={...} /> */}
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <Typography>67</Typography>
            <Typography>73</Typography>
            <Typography>53</Typography>
            <Typography>47</Typography>
            <Typography>39</Typography>
            <Typography>27</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Timeline;