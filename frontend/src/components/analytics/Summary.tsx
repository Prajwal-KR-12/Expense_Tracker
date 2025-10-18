import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

interface SummaryProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const Summary: React.FC<SummaryProps> = ({ totalIncome, totalExpenses, balance }) => {
  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e8f5e9' }}>
          <Typography variant="subtitle1" color="#2e7d32">Total Income</Typography>
          <Typography variant="h5" color="#2e7d32">₹{totalIncome.toLocaleString('en-IN')}</Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#ffebee' }}>
          <Typography variant="subtitle1" color="#c62828">Total Expenses</Typography>
          <Typography variant="h5" color="#c62828">₹{totalExpenses.toLocaleString('en-IN')}</Typography>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: '#e3f2fd' }}>
          <Typography variant="subtitle1" color="#1565c0">Balance</Typography>
          <Typography variant="h5" color={balance >= 0 ? '#1565c0' : '#c62828'}>
            ₹{balance.toLocaleString('en-IN')}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Summary;