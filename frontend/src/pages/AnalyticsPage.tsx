import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardHeader, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import CategoryChart from '../components/analytics/CategoryChart';
import MonthlySummaryChart from '../components/analytics/MonthlySummaryChart';
import StatCard from '../components/analytics/StatCard';
import { BarChart, TrendingUp, TrendingDown, AccountBalanceWallet, Category } from '@mui/icons-material';

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  spendingByCategory: { _id: string; total: number }[];
}

const AnalyticsPage = () => {
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

  const topCategory = summary?.spendingByCategory[0]?._id || 'N/A';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Financial Analytics
          </Typography>
        </Grid>

        {summary && (
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Income" value={`₹${summary.totalIncome.toLocaleString('en-IN')}`} icon={<TrendingUp />} color="#4caf50" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Total Expenses" value={`₹${summary.totalExpenses.toLocaleString('en-IN')}`} icon={<TrendingDown />} color="#f44336" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Net Savings" value={`₹${summary.balance.toLocaleString('en-IN')}`} icon={<AccountBalanceWallet />} color="#2196f3" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard title="Top Category" value={topCategory} icon={<Category />} color="#ff9800" />
            </Grid>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card sx={{ height: 600 }}>
              <CardHeader title="Spending by Category" subheader="A look at where your money is going." />
              <CardContent sx={{ height: 'calc(100% - 72px)' }}>
                {summary && <CategoryChart data={summary.spendingByCategory} />}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card sx={{ height: 600 }}>
              <CardHeader title="Monthly Summary" subheader="A comparison of your income and expenses over time." />
              <CardContent sx={{ height: 'calc(100% - 72px)' }}>
                <MonthlySummaryChart />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default AnalyticsPage;
