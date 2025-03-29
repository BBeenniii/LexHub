import React, { useEffect, useState } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatMessages from './ChatMessages';
import { getUser } from '../utils/auth-utils';
import { useLocation } from 'react-router-dom';
import { User } from '../types/User';

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
    if (storedUser) setUser(storedUser);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const res = await fetch(`http://localhost:3001/messages/conversations/${user.userType}/${user.id}`);
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
  }, [user, forcedConvId]);

  if (!user) {
    return <p style={{ padding: 20 }}>A csevegések megtekintéséhez be kell jelentkeznie...</p>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ChatSidebar
        conversations={conversations}
        selectedConv={selectedConv}
        onSelect={setSelectedConv}
      />
      <div style={{ flex: 1, borderLeft: '1px solid #ccc' }}>
        {selectedConv ? (
          <ChatMessages
            conversationId={selectedConv.id}
            currentUserId={user.id}
            otherUser={selectedConv.participant}
          />
        ) : (
          <p style={{ padding: 20 }}>Válasszon egy beszélgetést a bal oldali listából.</p>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;
