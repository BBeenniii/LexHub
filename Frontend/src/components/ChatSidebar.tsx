import React from 'react';

interface Conversation {
  id: number;
  participant: {
    id: number;
    name: string;
    email: string;
  };
}

interface Props {
  conversations: Conversation[];
  selectedConv: Conversation | null;
  onSelect: (conv: Conversation) => void;
}

const ChatSidebar: React.FC<Props> = ({ conversations, selectedConv, onSelect }) => {
  return (
    <div style={{ width: 250, borderRight: '1px solid #ccc', padding: 10 }}>
      <h4>Kapcsolatok</h4>
      {conversations.length === 0 && <p>Nincsenek beszélgetések.</p>}
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv)}
          style={{
            padding: '10px 8px',
            cursor: 'pointer',
            backgroundColor: selectedConv?.id === conv.id ? '#e0e0e0' : 'transparent',
            borderRadius: 6,
            marginBottom: 4,
          }}
        >
          <strong>{conv.participant.name}</strong>
          <br />
          <small>{conv.participant.email}</small>
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;