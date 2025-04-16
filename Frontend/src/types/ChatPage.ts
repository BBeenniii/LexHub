export interface Conversation {
  id: number;
  participant: {
    id: number;
    name: string;
    email: string;
  };
}