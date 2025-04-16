export interface Message {
  id?: number;
  text: string;
  senderId: number;
  receiverId: number;
  conversationId: number;
  createdAt?: string;
  isEdited: boolean;
}

export interface Props {
  conversationId: number;
  currentUserId: number;
  otherUser: { id: number; name: string };
}