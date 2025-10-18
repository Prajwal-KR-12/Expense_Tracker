const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateChatReply = async (userId, message, history) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const transactions = await Transaction.find({ user: userObjectId }).sort({ date: -1 }).limit(30);

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

  return completion.choices[0].message.content.trim();
};

module.exports = { generateChatReply };
