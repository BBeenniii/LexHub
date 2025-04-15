import React, { useEffect, useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import { getUser } from '../utils/auth-utils';
import { useLocation } from 'react-router-dom';
import { User } from '../types/User';
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

  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser) {
      setUser(storedUser);

      const fetchConversations = async () => {
        try {
          const res = await fetch(`http://localhost:3001/messages/conversations/${storedUser.userType}/${storedUser.id}`);
          const data = await res.json();

          if (Array.isArray(data)) {
            setConversations(data);

            if (forcedConvId) {
              const match = data.find((c) => c.id === forcedConvId);
              if (match) {
                setSelectedConv(match);
                return;
              }
            }

            if (data.length > 0) {
              setSelectedConv(data[0]);
            }
          } else {
            console.warn("Nem tömb jött vissza:", data);
          }
        } catch (err) {
          console.error("Hiba a beszélgetések lekérésekor:", err);
        }
      };

      fetchConversations();
    }
  }, [forcedConvId]);

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