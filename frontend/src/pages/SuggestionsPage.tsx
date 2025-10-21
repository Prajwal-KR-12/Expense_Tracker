import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Typography, Container, Alert, Grid, Paper } from '@mui/material';

interface SummaryData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  spendingByCategory: { _id: string; total: number }[];
}

const recommendations = {
  'Essential Needs': 50,
  'Emergency Savings / Medical': 10,
  'Long-term Savings': 10,
  'Entertainment & Leisure': 10,
  'Personal Growth': 10,
  'Miscellaneous / Donations / Others': 10,
};

const categoryMapping: { [key: string]: string } = {
  'Food': 'Essential Needs',
  'Transport': 'Essential Needs',
  'Utilities': 'Essential Needs',
  'Health': 'Emergency Savings / Medical',
  'Entertainment': 'Entertainment & Leisure',
  'Others': 'Miscellaneous / Donations / Others',
};

const SuggestionsPage: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

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

  useEffect(() => {
    if (summary && summary.totalIncome > 0) {
      const newSuggestions: string[] = [];
      const { totalIncome, totalExpenses, spendingByCategory } = summary;

      // Check total expenses against total income
      const expenseToIncomeRatio = (totalExpenses / totalIncome) * 100;
      if (expenseToIncomeRatio > 80) {
        newSuggestions.push(
          `Your total expenses are ${expenseToIncomeRatio.toFixed(2)}% of your total income, which is high. Consider reducing your spending.`
        );
      }

      const spending: { [key: string]: number } = {};

      for (const category of spendingByCategory) {
        const recommendationCategory = categoryMapping[category._id];
        if (recommendationCategory) {
          if (!spending[recommendationCategory]) {
            spending[recommendationCategory] = 0;
          }
          spending[recommendationCategory] += category.total;
        }
      }

      for (const recommendationCategory in spending) {
        const categorySpending = spending[recommendationCategory];
        const recommendedPercentage = recommendations[recommendationCategory as keyof typeof recommendations];

        if (recommendedPercentage) {
          const actualPercentage = (categorySpending / totalIncome) * 100;
          if (actualPercentage > recommendedPercentage) {
            newSuggestions.push(
              `You are spending ${actualPercentage.toFixed(2)}% of your income on ${recommendationCategory}, which is higher than the recommended ${recommendedPercentage}%.`
            );
          }
        }
      }

      setSuggestions(newSuggestions);
    }
  }, [summary]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Suggestions
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        {suggestions.length > 0 ? (
          <Grid container spacing={2}>
            {suggestions.map((suggestion, index) => (
              <Grid item xs={12} key={index}>
                <Alert severity="warning">{suggestion}</Alert>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            No suggestions at the moment. Your spending is within the recommended limits.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default SuggestionsPage;