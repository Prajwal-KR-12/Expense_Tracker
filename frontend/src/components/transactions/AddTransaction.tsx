import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Typography } from '@mui/material';

interface AddTransactionProps {
  onTransactionAdded: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    amount: '',
    date: '',
    note: '',
  });

  const { type, category, amount, date, note } = formData;

  const categories = [
    'Food', 'Transport', 'Rent', 'Utilities', 'Shopping',
    'Health', 'Entertainment', 'Savings', 'Others'
  ];

  const onChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    setFormData({ ...formData, [e.target.name as string]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await axios.post('http://localhost:5000/api/transactions', formData, {
        headers: { 'x-auth-token': token },
      });
      onTransactionAdded();
      setFormData({
        type: 'expense',
        category: '',
        amount: '',
        date: '',
        note: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Typography variant="h6" gutterBottom>Add New Transaction</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select name="type" value={type} label="Type" onChange={onChange as any}>
              <MenuItem value="expense">Expense</MenuItem>
              <MenuItem value="income">Income</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select name="category" value={category} label="Category" onChange={onChange as any}>
              {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            name="amount"
            label="Amount (₹)"
            value={amount}
            onChange={onChange}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            type="date"
            name="date"
            value={date}
            onChange={onChange}
            required
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="note"
            label="Note"
            value={note}
            onChange={onChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>Add Transaction</Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default AddTransaction;
