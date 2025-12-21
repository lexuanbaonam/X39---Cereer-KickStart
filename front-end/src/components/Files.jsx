import React from 'react';
import { Box, Grid, Typography, Button, Avatar } from '@mui/material';
import './Files.css';

const Files = () => {
  return (
    <Box className="files-container">
      <Box className="files-header">
        <Typography variant="h5" color="primary">Files</Typography>
        <Box>
          <Button variant="contained" color="primary" className="create-folder-btn">
            + Create New Folder
          </Button>
          <Button variant="outlined" color="primary" className="upload-btn">
            <span role="img" aria-label="upload">📤</span> Upload
          </Button>
        </Box>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <Box className="all-files-section">
            <Box className="section-header">
              <Typography variant="subtitle1">All Files</Typography>
              <Button variant="text" color="primary" size="small">
                Show All <span role="img" aria-label="arrow">▼</span>
              </Button>
            </Box>
            <Grid container spacing={2}>
              {['Documents', 'Music', 'Work Project', 'Personal Media', 'Reddingo Backup', 'Root'].map((folder, index) => (
                <Grid item xs={4} key={index}>
                  <Box className="folder-card">
                    <Avatar sx={{ bgcolor: index === 3 ? '#f4b400' : index === 4 ? '#34a853' : index === 5 ? '#db4437' : '#4285f4' }}>
                      {index === 0 || index === 1 || index === 2 ? '📄' : index === 3 ? '📹' : index === 4 ? '📦' : '🌱'}
                    </Avatar>
                    <Typography variant="body2">{folder}</Typography>
                    <Typography variant="caption" className="folder-count">
                      {index === 0 ? '24 files' : index === 1 ? '102 files' : index === 2 ? '84 files' : index === 3 ? '2450 files' : index === 4 ? '22 files' : '105 files'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box className="recent-files-section">
            <Box className="section-header">
              <Typography variant="subtitle1">Recent File</Typography>
              <Button variant="text" color="primary" size="small">
                View All <span role="img" aria-label="arrow">▼</span>
              </Button>
            </Box>
            <Box className="recent-files-table">
              <Box className="table-header">
                <Typography variant="caption">Name</Typography>
                <Typography variant="caption">Size</Typography>
                <Typography variant="caption">Last Modified</Typography>
              </Box>
              {['Proposal.docx', 'Background.jpg', 'Apex website.fig', 'Illustration.ai'].map((file, index) => (
                <Box key={index} className="table-row">
                  <Avatar sx={{ bgcolor: index === 0 ? '#f4b400' : index === 1 ? '#34a853' : index === 2 ? '#4285f4' : '#db4437' }}>
                    {index === 0 ? '📄' : index === 1 ? '📷' : index === 2 ? '🌐' : '🎨'}
                  </Avatar>
                  <Typography variant="body2">{file}</Typography>
                  <Typography variant="caption">{index === 0 ? '2.9 MB' : index === 1 ? '3.5 MB' : index === 2 ? '23.5 MB' : '7.2 MB'}</Typography>
                  <Typography variant="caption">{index === 0 ? 'Feb 25,2022' : index === 1 ? 'Feb 24,2022' : index === 2 ? 'Feb 22,2022' : 'Feb 20,2022'}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box className="storage-section">
            <Box className="section-header">
              <Typography variant="subtitle1">Available Storage</Typography>
            </Box>
            <Box className="storage-content">
              <Typography variant="h6">85%</Typography>
              <Typography variant="body2">130GB / 512GB</Typography>
            </Box>
          </Box>

          <Box className="activity-chart-section">
            <Box className="section-header">
              <Typography variant="subtitle1">Activity Chart</Typography>
            </Box>
            <Box className="chart-placeholder">
              <Box className="bar-chart">
                <Box className="bar blue" />
                <Box className="bar red" />
                <Box className="bar yellow" />
                <Box className="bar blue-short" />
              </Box>
              <Box className="legend">
                <Typography variant="caption">★ Media</Typography>
                <Typography variant="caption">★ Photos</Typography>
                <Typography variant="caption">★ Docs</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Files;