import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, CircularProgress, Box } from '@mui/material';

const AIInsights = () => {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/ai/insights', {
          headers: { 'x-auth-token': token },
        });
        setInsights(res.data.insights);
      } catch (err) {
        console.error(err);
        setInsights('Could not load insights at the moment.');
      }
      setLoading(false);
    };

    fetchInsights();
  }, []);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>💡 Smart Tips</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{insights}</Typography>
      )}
    </Box>
  );
};

export default AIInsights;
