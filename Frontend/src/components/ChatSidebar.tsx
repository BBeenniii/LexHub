import React from 'react';
import "../style/Chat.css";

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
    <div className="chat-sidebar">
  <h4>Kapcsolatok</h4>
  {conversations.length === 0 && <p>Nincsenek beszélgetések.</p>}
  {conversations.map((conv) => (
    <div
      key={conv.id}
      className={`chat-contact ${selectedConv?.id === conv.id ? 'active' : ''}`}
      onClick={() => onSelect(conv)}
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