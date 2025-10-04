const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getInsights = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 }).limit(100);

    if (transactions.length < 5) {
      return res.json({ insights: "Not enough transaction data to generate meaningful insights. Keep tracking your expenses!" });
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
      max_tokens: 200,
    });

    const insights = completion.choices[0].message.content.trim();
    res.json({ insights });

  } catch (err) {
    console.error(err.message);
    if (err.code === 'insufficient_quota' || (err.response && err.response.status === 429)) {
      return res.status(402).json({ msg: 'Could not generate insights due to an issue with the AI service provider. Please check your OpenAI billing details.' });
    }
    if (err.response && err.response.status === 401) {
        return res.status(401).json({ msg: 'Could not authenticate with the AI service provider. Please check your API key.' });
    }
    res.status(500).send('Server Error');
  }
};

const chat = async (req, res) => {
  const { message, history } = req.body;
  const userId = new mongoose.Types.ObjectId(req.user.id);

  try {
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 }).limit(30);

    const formattedTransactions = JSON.stringify(transactions.map(t => ({
      type: t.type,
      category: t.category,
      amount: t.amount,
      date: t.date.toISOString().split('T')[0],
      note: t.note
    })), null, 2);

    const systemPrompt = `
      You are a friendly and helpful financial assistant for an expense tracker app in India (currency is INR).
      Your goal is to answer the user's questions based on their recent transaction history and provide helpful financial advice.
      When asked for data, be precise. When asked for advice, be encouraging.

      Here is the user's recent transaction history in JSON format:
      ${formattedTransactions}
    `;

    const messages = [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 250,
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });

  } catch (err) {
    console.error(err.message);
    if (err.code === 'insufficient_quota' || (err.response && err.response.status === 429)) {
      return res.status(402).json({ msg: 'Could not process chat due to an issue with the AI service provider. Please check your OpenAI billing details.' });
    }
    if (err.response && err.response.status === 401) {
        return res.status(401).json({ msg: 'Could not authenticate with the AI service provider. Please check your API key.' });
    }
    res.status(500).send('Server Error');
  }
};

module.exports = { getInsights, chat };
