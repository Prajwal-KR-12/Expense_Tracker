import React, { useState } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, List, ListItem, ListItemText, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ChatProps {
  onTransactionAdded: () => void;
}

const Chat: React.FC<ChatProps> = ({ onTransactionAdded }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/ai/chat',
        { message: input },
        { headers: { 'x-auth-token': token } }
      );
      const botMessage: Message = { sender: 'bot', text: JSON.stringify(res.data.reply, null, 2) };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      onTransactionAdded(); // Call the callback function
    } catch (err) {
      console.error(err);
      const botMessage: Message = { sender: 'bot', text: 'Sorry, I am having trouble connecting to the server.' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }

    setInput('');
  };

  return (
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
      <Paper elevation={3} style={{ padding: '1rem', marginTop: '1rem' }}>
        <Typography variant="h5" gutterBottom>
          AI Assistant
        </Typography>
        <List style={{ height: '300px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <ListItem key={index}>
              <ListItemText primary={msg.text} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }} />
            </ListItem>
          ))}
        </List>
        <TextField
          label="Ask something..."
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginTop: '1rem' }}>
          Send
        </Button>
      </Paper>
    </motion.div>
  );
};

export default Chat;
