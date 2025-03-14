// Tipos para los mensajes
export type MessageType = "user" | "agent" | "loading";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  phases?: string[];
  currentPhase?: number;
  isNew?: boolean;
} 