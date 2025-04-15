import React, { useEffect, useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import { getUser } from '../utils/auth-utils';
import { useLocation } from 'react-router-dom';
import { User } from '../types/User';
import { useSocket } from '../context/SocketContext';
import "../style/Chat.css";

interface Conversation {
  id: number;
  participant: {
    id: number;
    name: string;
    email: string;
  };
}

const ChatsPage: React.FC = () => {
  const location = useLocation();
  const forcedConvId = location.state?.selectedConversationId;
  const socket = useSocket();

  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);

  // fetchConversation 
  const fetchConversations = async (user: User, convId?: number) => {
    try {
      const res = await fetch(`http://localhost:3001/messages/conversations/${user.userType}/${user.id}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setConversations(data);

        const match = convId ? data.find((c) => c.id === convId) : null;
        setSelectedConv(match || data[0] || null);
      } else {
        console.warn("Nem tömb jött vissza:", data);
      }
    } catch (err) {
      console.error("Hiba a beszélgetések lekérésekor:", err);
    }
  };

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchConversations(user, forcedConvId);
    }
  }, [user]);

  // Realtime sidebar frissítés
  useEffect(() => {
    if (!socket || !user) return;

    const handleUpdate = () => {
      fetchConversations(user); 
    };

    socket.on('chatUpdated', handleUpdate);
    return () => {
      socket.off('chatUpdated', handleUpdate);
    };
  }, [socket, user]);

  if (!user) {
    return <p style={{ padding: 20 }}>A csevegések megtekintéséhez be kell jelentkeznie...</p>;
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-page">
        <ChatSidebar
          conversations={conversations}
          selectedConv={selectedConv}
          onSelect={setSelectedConv}
        />
        <div className="chat-main">
          {selectedConv ? (
            <ChatMessages
              conversationId={selectedConv.id}
              currentUserId={user.id}
              otherUser={selectedConv.participant}
            />
          ) : (
            <p className="chat-placeholder">Válasszon egy beszélgetést a bal oldali listából.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatsPage;