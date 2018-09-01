import { Conversation } from "./conversation";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  conversations: {[key:string]:Conversation};
}