import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Summary from '../components/analytics/Summary';

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  spendingByCategory: { _id: string; total: number }[];
}

const Dashboard = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);

  const fetchSummary = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/analytics/summary', {
        headers: { 'x-auth-token': token },
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
        </Grid>
        {summary && (
          <Grid item xs={12}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <Summary 
                totalIncome={summary.totalIncome} 
                totalExpenses={summary.totalExpenses} 
                balance={summary.balance} 
              />
            </motion.div>
          </Grid>
        )}
      </Grid>
    </motion.div>
  );
};

export default Dashboard;
