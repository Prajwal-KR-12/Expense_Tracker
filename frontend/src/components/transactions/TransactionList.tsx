import React from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface Transaction {
  _id: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  note?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  fetchTransactions: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, fetchTransactions }) => {
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
    <>
      <Typography variant="h6" gutterBottom>Recent Transactions</Typography>
      <List>
        {transactions.map(transaction => (
          <ListItem
            key={transaction._id}
            secondaryAction={
              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(transaction._id)}>
                <Delete />
              </IconButton>
            }
          >
            <ListItemText
              primary={transaction.category}
              secondary={transaction.note}
            />
            <Typography variant="body1" color={transaction.type === 'income' ? 'green' : 'red'}>
              {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TransactionList;
