import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() !== '') {
      setMessages((prevMessages) => [...prevMessages, { text: newMessage, sender: 'user' }]);
      setNewMessage('');

      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, { text: `Hello wordl`, sender: 'nyc' }]);
      }, 1000);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 40px)',
        maxWidth: 600,
        margin: '20px auto',
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Tính năng đang phát tiển
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          padding: 2,
          overflowY: 'auto',
          backgroundColor: 'background.default',
        }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem
              key={index}
              sx={{
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                paddingY: 0.5,
              }}
            >
              <Paper
                sx={{
                  backgroundColor: msg.sender === 'user' ? 'success.light' : 'grey.300',
                  padding: '8px 12px',
                  borderRadius: '15px',
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                }}
              >
                <ListItemText primary={msg.text} />
              </Paper>
            </ListItem>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          display: 'flex',
          padding: 2,
          borderTop: '1px solid #eee',
          backgroundColor: 'white',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nhập tin nhắn của bạn..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          size="small"
          sx={{ mr: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
        >
          Gửi
        </Button>
      </Box>
    </Box>
  );
}

export default Chat;