import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Badge,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Message as MessageIcon,
  Delete as DeleteIcon,
  MarkAsUnread as MarkAsUnreadIcon,
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: { main: '#4a90e2' },
    success: { main: '#28a745' },
    warning: { main: '#ffc107' },
    error: { main: '#dc3545' },
    info: { main: '#17a2b8' },
    background: { default: '#f9f9f9', paper: '#ffffff' },
    text: { primary: '#333', secondary: '#888' },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    body1: { lineHeight: 1.6 },
    body2: { fontSize: '0.875rem' },
  },
  spacing: 8,
  shape: { borderRadius: 8 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function Notifications() {
  const [notifications, setNotifications] = useState([

    {
      id: 1,
      type: 'system',
      title: 'Hello world',
      message: 'Nhóm trưởng đã đuổi bạn',
      time: '100000 tiếng trước',
      read: false,
      avatar: null,
    },



  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleMenuOpen = (event, notification) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const toggleReadStatus = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: !n.read } : n
    ));
    handleMenuClose();
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
    handleMenuClose();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message': return <MessageIcon color="primary" />;
      case 'system': return <InfoIcon color="info" />;
      case 'warning': return <WarningIcon color="warning" />;
      case 'success': return <CheckCircleIcon color="success" />;
      default: return <NotificationsIcon color="primary" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            gap: 2,
          }}
        >
          <Badge badgeContent={unreadCount} color="primary">
            <NotificationsIcon sx={{ fontSize: 32, color: 'text.primary' }} />
          </Badge>
          <Typography variant="h5" color="text.primary">
            Notifications
          </Typography>
        </Box>

        {notifications.length === 0 ? (
          <Paper sx={{ mb: 2, borderRadius: 2, overflow: 'hidden', p: 4, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You're all caught up!
            </Typography>
          </Paper>
        ) : (
          <List disablePadding>
            {notifications.map((notification) => (
              <Paper
                key={notification.id}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <ListItem
                  sx={{
                    p: 2,
                    backgroundColor: notification.read ? 'transparent' : 'rgba(74, 144, 226, 0.02)',
                    borderLeft: notification.read ? 'none' : `4px solid ${theme.palette.primary.main}`,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={notification.avatar}
                      sx={{
                        bgcolor: !notification.avatar ? 'primary.main' : undefined,
                        width: 50,
                        height: 50,
                      }}
                    >
                      {!notification.avatar && getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: 'primary.main',
                              mr: 1,
                            }}
                          />
                        )}
                        <Typography variant="subtitle1" fontWeight="medium">
                          {notification.title}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {notification.time}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, notification)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {selectedNotification && (
            <>
              <MenuItem onClick={() => toggleReadStatus(selectedNotification.id)}>
                <Box display="flex" alignItems="center" gap={1}>
                  <MarkAsUnreadIcon fontSize="small" />
                  {selectedNotification.read ? 'Mark as unread' : 'Mark as read'}
                </Box>
              </MenuItem>
              <MenuItem onClick={() => deleteNotification(selectedNotification.id)}>
                <Box display="flex" alignItems="center" gap={1}>
                  <DeleteIcon fontSize="small" />
                  Delete
                </Box>
              </MenuItem>
            </>
          )}
        </Menu>
      </Container>
    </ThemeProvider>
  );
}

export default Notifications;