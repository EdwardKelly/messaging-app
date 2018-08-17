import { Message } from "./message";

export interface Conversation {
    cid: string;
    name: string;
    memberIds: string[];
    messages: Message[];
  }