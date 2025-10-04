import React from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

interface Transaction {
  _id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  fetchTransactions: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, fetchTransactions }) => {
  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { 'x-auth-token': token },
      });
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead sx={{ backgroundColor: 'primary.main' }}>
          <TableRow>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Amount</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Note</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((row, index) => (
            <TableRow
              key={row._id}
              sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
            >
              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.category}</TableCell>
              <TableCell align="right">
                <Typography color={row.type === 'income' ? 'success.main' : 'error.main'} sx={{ fontWeight: 'bold' }}>
                  {row.type === 'income' ? '+' : '-'}₹{row.amount.toLocaleString('en-IN')}
                </Typography>
              </TableCell>
              <TableCell>{row.note}</TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => handleDelete(row._id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
