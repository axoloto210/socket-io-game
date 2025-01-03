import { useState, useEffect } from 'react';
import { Socket, io } from 'socket.io-client';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected!');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected!');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('serverMessage', (msg: string) => {
      console.log('Server message:', msg);
      setServerMessage(msg);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket && message.trim()) {
      console.log('sent',message)
      socket.emit('message', message);
      setMessage('');
    }
  };

  return (
    <div className="container">
      <h1>Socket.IO Test</h1>
      <div className="status">
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>

      {isConnected && (
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button type="submit">Send</button>
        </form>
      )}

      {serverMessage && (
        <div className="server-message">
          {serverMessage}
        </div>
      )}
    </div>
  );
}

export default App