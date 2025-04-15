import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import '../style/Chat.css';
import { Pencil, Trash2, Save } from 'lucide-react';

interface Message {
  id?: number;
  text: string;
  senderId: number;
  receiverId: number;
  conversationId: number;
  createdAt?: string;
  isEdited: boolean;
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
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState('');
  const isEditable = (msg: Message) => Date.now() - new Date(msg.createdAt!).getTime() < 60 * 60 * 1000;
  const isDeletable = (msg: Message) => Date.now() - new Date(msg.createdAt!).getTime() < 24 * 60 * 60 * 1000;  
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null);

  const formatMessageTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
  
    const isSameDay =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  
    return isSameDay
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) // 13:47
      : date.toLocaleDateString('hu-HU'); // 2024. 04. 15.
  };

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    socket.on('messageEdited', (updatedMsg: Message) => {
      setMessages(prev =>
        prev.map(msg => msg.id === updatedMsg.id ? { ...msg, ...updatedMsg } : msg)
      );
    });
  
    return () => {
      socket.off('messageEdited');
    };
  }, []);
  
  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const newMessage: Message = {
      text: input.trim(),
      senderId: currentUserId,
      receiverId: otherUser.id,
      conversationId,
      isEdited: false
    };

    socket.emit('sendMessage', newMessage);
    setInput('');
  };

  // Edit message rész
  const startEditing = (msg: Message) => {
    setEditingMessageId(msg.id!);
    setEditInput(msg.text);
  };
  
  const saveEditedMessage = () => {
    if (socket && editingMessageId !== null) {
      socket.emit('editMessage', {
        messageId: editingMessageId,
        newText: editInput,
        conversationId,
        senderId: currentUserId,
        receiverId: otherUser.id,
      });      
  
      setMessages((prev) =>
        prev.map((m) => (m.id === editingMessageId ? { ...m, text: editInput } : m))
      );
  
      setEditingMessageId(null);
      setEditInput('');
    }
  };
  
  // Delete message rész
  const handleDelete = (msg: Message) => {
    if (socket) {
      socket.emit('deleteMessage', {
        messageId: msg.id,
        conversationId,
      });
  
      setMessages((prev) => prev.filter((m) => m.id !== msg.id));
    }
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
            onClick={() => {
              if (isOwn && (isEditable(msg) || isDeletable(msg))) {
                setActiveMessageId(activeMessageId === msg.id ? null : msg.id!)}
              }
            }
            >
            <div className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
              {editingMessageId === msg.id ? (
                <div className="edit-box">
                  <input
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEditedMessage();
                        setActiveMessageId(null); 
                      }
                    }}
                  />
                  <button onClick={saveEditedMessage}><Save size={16} /></button>
                </div>
              ) : (
                <>
                  <div className="message-text-block">
                    {msg.text}
                    {msg.isEdited && (
                      <span className="edited-label"> (szerkesztve)</span>
                    )}
                  </div>
                  <div className="message-time">
                    {msg.createdAt ? formatMessageTimestamp(msg.createdAt) : ''}
                  </div>
                </>
              )}
            </div>

            {isOwn && activeMessageId === msg.id && (
              <div className="message-actions-clicked">
                {isEditable(msg) && (
                  <button onClick={() => startEditing(msg)} title="Szerkesztés"><Pencil size={16} /></button>
                )}
                {isDeletable(msg) && (
                  <button onClick={() => handleDelete(msg)} title="Törlés"><Trash2 size={16} /></button>
                )}
              </div>
            )}
          </div>
          );
        })}
        <div ref={bottomRef} />
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