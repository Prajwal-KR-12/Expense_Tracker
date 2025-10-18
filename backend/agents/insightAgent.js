const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateInsights = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const transactions = await Transaction.find({ user: userObjectId }).sort({ date: -1 }).limit(100);

  if (transactions.length < 5) {
    return "Not enough transaction data to generate meaningful insights. Keep tracking your expenses!";
  }

  const summary = transactions.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc.totalExpenses = (acc.totalExpenses || 0) + t.amount;
      acc.spendingByCategory[t.category] = (acc.spendingByCategory[t.category] || 0) + t.amount;
    }
    return acc;
  }, { totalExpenses: 0, spendingByCategory: {} });

  const prompt = `
    You are a financial analyst for an Indian user. Your task is to provide 2-3 concise, actionable, and encouraging financial tips based on their recent spending habits. The currency is INR (₹).

    Here is a summary of their recent expenses:
    - Total Expenses: ₹${summary.totalExpenses.toLocaleString('en-IN')}
    - Spending Breakdown by Category:
      ${Object.entries(summary.spendingByCategory)
        .map(([cat, total]) => `- ${cat}: ₹${total.toLocaleString('en-IN')}`)
        .join('\n')}

    Analyze this data and provide personalized tips. For example, if spending on 'Food' is high, suggest specific ways to save on food in India. Be specific and empathetic.
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 200,
  });

  return completion.choices[0].message.content.trim();
};

module.exports = { generateInsights };
