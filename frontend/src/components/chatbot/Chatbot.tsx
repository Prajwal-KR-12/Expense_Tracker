import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.post('http://localhost:5000/api/ai/chat', 
          { message: input, history: newMessages.slice(0, -1) }, 
          {
            headers: { 'x-auth-token': token },
          }
        );
        const assistantMessage = { role: 'assistant', content: res.data.reply };
        setMessages(prevMessages => [...prevMessages, assistantMessage]);
      } catch (err) {
        console.error(err);
        const errorMessage = { role: 'assistant', content: 'Sorry, I am having trouble connecting. Please try again later.' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      }
    }
  };

  return (
    <>
      <div className="fixed bottom-5 right-5">
        <button onClick={toggleChat} className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl">
          💬
        </button>
      </div>
      {isOpen && (
        <div className="fixed bottom-24 right-5 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          <div className="p-4 bg-indigo-600 text-white rounded-t-lg">
            <h3 className="font-bold">AI Financial Assistant</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`my-2 p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-right' : 'bg-gray-100'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <div className="flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md"
                placeholder="Ask a question..."
              />
              <button onClick={handleSend} className="px-4 py-2 bg-indigo-600 text-white rounded-r-md">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
