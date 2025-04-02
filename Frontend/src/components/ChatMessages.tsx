import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import '../style/Chat.css';

interface Message {
  id?: number;
  text: string;
  senderId: number;
  receiverId: number;
  conversationId: number;
  createdAt?: string;
}

interface Props {
  conversationId: number;
  currentUserId: number;
  otherUser: { id: number; name: string };
}

const ChatMessages: React.FC<Props> = ({ conversationId, currentUserId, otherUser }) => {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  // Üzenetek betöltése
  useEffect(() => {
    if (!socket) return;

    socket.emit('getMessages', { conversationId });

    const handleLoadedMessages = (msgs: Message[]) => {
      setMessages(msgs);
    };

    socket.on('loadedMessages', handleLoadedMessages);
    return () => {
      socket.off('loadedMessages', handleLoadedMessages);
    };
  }, [socket, conversationId]);

  // Valós idejű frissítés
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (updatedConversationId: number) => {
      if (updatedConversationId === conversationId) {
        socket.emit('getMessages', { conversationId });
      }
    };

    socket.on('chatUpdated', handleUpdate);
    return () => {
      socket.off('chatUpdated', handleUpdate);
    };
  }, [socket, conversationId]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const newMessage: Message = {
      text: input.trim(),
      senderId: currentUserId,
      receiverId: otherUser.id,
      conversationId,
    };

    socket.emit('sendMessage', newMessage);
    setInput('');
  };

  return (
    <div className="chat-box">
      <div className="chat-messages-scroll">
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id || index}
              className={`message-container ${isOwn ? 'own' : 'other'}`}
            >
              <div className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
                {msg.text}
                <div className="message-time">
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          placeholder="Üzenet írása..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Küldés</button>
      </div>
    </div>
  );
};

export default ChatMessages;
