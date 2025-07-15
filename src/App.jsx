// src/App.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Update with your backend URL
const socket = io('https://chatmate-ws-server.onrender.com/', {
  withCredentials: true
});

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const joinRoom = () => {
    if (room) {
      socket.emit('joinRoom', room);
      console.log(`Joined room: ${room}`);
    }
  };

  const sendMessage = () => {
    if (message && room) {
      socket.emit('messageToRoom', { roomName: room, message });
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
        ChatMate
      </h1>
      
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-xl space-y-6 text-gray-800">
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Enter Room Name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={joinRoom}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white py-3 rounded-md font-semibold transition-transform transform hover:scale-105"
          >
            Join Room
          </button>
        </div>

        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Enter Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={sendMessage}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white py-3 rounded-md font-semibold transition-transform transform hover:scale-105"
          >
            Send Message
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Messages:</h2>
          <ul className="space-y-3 max-h-64 overflow-y-auto">
            {messages.map((msg, index) => (
              <li key={index} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-md">
                <strong>{msg.userId}:</strong> {msg.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
