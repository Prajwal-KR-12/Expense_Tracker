const axios = require('axios');
const { generateInsights } = require('../agents/insightAgent');

const getInsights = async (req, res) => {
  try {
    const insights = await generateInsights(req.user.id);
    res.json({ insights });
  } catch (err) {
    console.error(err.message);
    // Generic error handling for agent failures
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
  const { message } = req.body;
  const apiKey = 'AIzaSyBD60v4bBT3TTHbygHdK9KqshQNyklxUqU'; // The user's API key

  const prompt = `
    You are a data entry agent for an expense tracker.
    Your task is to extract the transaction details from the user's message and respond with a JSON object.

    User message: "${message}"

    Extract the following information:
    - type (string): The type of the transaction. It can be either "income" or "expense".
    - amount (float): The amount of the transaction.
    - category (string): The category of the transaction. If not specified, use "Uncategorized" for expenses and "Salary" for income.
    - description (string): A brief description of the transaction. If not specified, use the user's message.
    - date (string, YYYY-MM-DD): The date of the transaction. If the user says "yesterday", the date is 2025-10-16. If the user says "today", the date is 2025-10-17.

    Example 1:
    User message: "I spent 250 on groceries today"
    {
      "type": "expense",
      "amount": 250.0,
      "category": "Groceries",
      "description": "I spent 250 on groceries today",
      "date": "2025-10-17"
    }

    Example 2:
    User message: "income credited 50000"
    {
      "type": "income",
      "amount": 50000.0,
      "category": "Salary",
      "description": "income credited 50000",
      "date": "2025-10-17"
    }

    Respond with only the JSON object.
  `;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    let generatedText = response.data.candidates[0].content.parts[0].text;
    
    if (generatedText.startsWith("```json")) {
      generatedText = generatedText.substring(7, generatedText.length - 3);
    }

    const jsonResponse = JSON.parse(generatedText);

    // Save the new transaction to the database
    await axios.post(`http://localhost:${req.socket.localPort}/api/transactions`, jsonResponse, {
        headers: { 'x-auth-token': req.header('x-auth-token') },
    });

    res.json({ reply: jsonResponse });

  } catch (error) {
    console.error('Error calling Gemini API or saving transaction:', error.response ? error.response.data : error.message);
    res.status(500).send('Server Error: Could not process the chat message.');
  }
};

module.exports = { getInsights, chat };

