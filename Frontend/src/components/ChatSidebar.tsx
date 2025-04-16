import React from 'react';
import { Conversation ,Props } from '../types/ChatSidebar';
import "../style/Chat.css";

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