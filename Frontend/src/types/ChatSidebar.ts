export interface Conversation {
  id: number;
  participant: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Props {
  conversations: Conversation[];
  selectedConv: Conversation | null;
  onSelect: (conv: Conversation) => void;
}