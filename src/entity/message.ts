export interface Message {
  uid: string;
  name: string;
  content: string;
  timestamp: firebase.firestore.Timestamp
}