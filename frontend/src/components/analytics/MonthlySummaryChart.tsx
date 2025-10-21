import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from '@mui/material';

interface MonthlyData {
  _id: { year: number; month: number };
  totalIncome: number;
  totalExpenses: number;
}

const MonthlySummaryChart = () => {
  const [data, setData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/analytics/monthly-summary', {
          headers: { 'x-auth-token': token },
        });
        const formattedData = res.data.map((item: MonthlyData) => ({
          ...item,
          name: `${item._id.month}/${item._id.year}`,
        }));
        setData(formattedData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (data.length === 0) {
    return <Typography>No data available for monthly summary chart.</Typography>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
          <Legend />
          <Bar dataKey="totalIncome" fill="#673ab7" name="Income" />
          <Bar dataKey="totalExpenses" fill="#00bcd4" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>

  );
};

export default MonthlySummaryChart;
