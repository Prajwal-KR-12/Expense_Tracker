import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, CardHeader, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import AddTransaction from '../components/transactions/AddTransaction';
import TransactionTable from '../components/transactions/TransactionTable';
import { AddCircle, CloudDownload } from '@mui/icons-material';

interface Transaction {
  _id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchTransactions = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/transactions', {
        headers: { 'x-auth-token': token },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDownloadCSV = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/transactions/download-csv', {
        headers: { 'x-auth-token': token },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Transactions
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<CloudDownload />} 
            onClick={handleDownloadCSV}
            sx={{ mb: 2 }}
          >
            Download as CSV
          </Button>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card>
              <CardHeader title="Add Transaction" avatar={<AddCircle color="primary" />} />
              <CardContent>
                <AddTransaction onTransactionAdded={fetchTransactions} />
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid size={{ xs: 12, lg: 8 }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <TransactionTable transactions={transactions} fetchTransactions={fetchTransactions} />
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );
};

export default TransactionsPage;