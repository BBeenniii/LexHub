import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';

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

    console.log('[LOG]: getMessages emit:', conversationId);
    socket.emit('getMessages', { conversationId });

    const handleLoadedMessages = (msgs: Message[]) => {
      console.log('[LOG]: loadedMessages:', msgs);
      setMessages(msgs);
    };

    socket.on('loadedMessages', handleLoadedMessages);

    return () => {
      socket.off('loadedMessages', handleLoadedMessages);
    };
  }, [socket, conversationId]);

  // Real-time frissítés
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = (updatedConversationId: number) => {
      if (updatedConversationId === conversationId) {
        console.log('[LOG]: chatUpdated event meghivva, üzenetek újratöltése...');
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

    console.log('[LOG]: sendMessage emit:', newMessage);
    socket.emit('sendMessage', newMessage);
    setInput('');
  };

  return (
    <div className="chat-box" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
      {messages.map((msg, index) => {
        const isOwn = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id || index}
              style={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  background: isOwn ? '#dcf8c6' : '#f1f1f1',
                  padding: '8px 12px',
                  borderRadius: 10,
                  maxWidth: '60%',
                  alignSelf: isOwn ? 'flex-end' : 'flex-start',
                }}
              >
                {msg.text}
                <div style={{ fontSize: 10, textAlign: 'right', marginTop: 4 }}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString() : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #ccc' }}>
        <input
          type="text"
          value={input}
          placeholder="Üzenet írása..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 8 }}>
          Küldés
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
