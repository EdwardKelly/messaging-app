import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { User } from "../entity/user";
import { Conversation } from "../entity/conversation";
import { Message } from "../entity/message";
import { OpenConversationPage } from "../pages/open-conversation/open-conversation";

@Injectable()
export class Database {

  constructor (private db: AngularFirestore) {

  }

  /**
   * Adds a user to the database
   */
  async addUser(user: User) {
    this.db.collection("users").doc(user.uid).set({
      email: user.email,
      displayName: user.displayName
    });
  }

  /** 
   * Returns a user with all fields from database. Param only needs a uid
   */
  async loadUser(user: User): Promise<User> {    
    let self = this;
    return new Promise<User>((resolve,reject) =>{ 
      self.db.collection('users').doc(user.uid).ref.get()
      .then(async function(doc){
        user.displayName = doc.data().displayName;
        user.email = doc.data().email;
        user.conversations = await self.loadConversations(user.uid)
        resolve(user);
     })
    })
  }

  /**
   * Returns a query result with the user of the given email. 
   * Can return an empty result
   */
  async getUserByEmail(email: string) {
    return this.db.collection('users').ref.where("email", "==", email).get();
  }

  /**
   * Adds a conversation to database. Also adds the conversation to each member.
   * Returns the conversation with its generated cid.
   * @param conversation 
   */
  async createConversation(conversation) {
    var self = this;
    // create new conversation with name and members
    return self.db.collection('conversations').add({
      name: conversation.name
    }).then(function(docRef){
      // Add members to conversation
      conversation.cid = docRef.id;
      for (let uid of conversation.memberIds) {
        self.db.collection('conversations').doc(docRef.id).collection('members').doc(uid).set({});
      }
    }).then(function(){
      // Add conversation to members
      for (let uid of conversation.memberIds) {
        self.db.collection('users').doc(uid).collection('conversations').doc(conversation.cid).set({})
      }
    }).then(function(){
      return conversation;
    }).catch(function(e) {
      console.error(e);
    });
  }

  /**
   * Returns the conversations of the user with the given id.
   * @param uid 
   */
  async loadConversations(uid: string):Promise<{[key:string]:Conversation}> {
    let self = this;
    let conversations = {};
    return new Promise<{[key:string]:Conversation}>((resolve,reject)=> {
      self.db.collection('users').doc(uid).collection('conversations').ref.get()
      .then(async function(querySnapshot) {
        // Get user's conversation ids
        for (let doc of querySnapshot.docs){
          await self.db.collection('conversations').doc(doc.id).ref.get()
          .then(function(doc) {
            conversations[doc.id] = doc.data();
          })
        }
        resolve(conversations);
      })
      .catch(function(e) {
        console.error(e);
      })
    });
  }

  loadMessages(cid: string, uid: string, receiveMessages: (messages: Message[],page: any)=>void, page: OpenConversationPage) {
    let self = this;    
    self.db.collection('conversations').doc(cid).collection('messages').ref
    .orderBy("timestamp","asc").onSnapshot(function(querySnapshot) { 
      let messages: Message[] = []; 
      for (let change of querySnapshot.docChanges()){
        if (change.type == "added") {
          messages.push(change.doc.data() as Message)
        }
      }        
      receiveMessages(messages,page);
    })
  }

  async sendMessage(cid: string, message: Message) {
    let self = this;
    self.db.collection('conversations').doc(cid).collection('messages').add(message);
  }

}