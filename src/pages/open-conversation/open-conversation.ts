import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { User } from '../../entity/user';
import { Conversation } from '../../entity/conversation';
import { Message } from '../../entity/message';
import { Database } from '../../helper/database';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import firebase from '../../../node_modules/firebase';

@IonicPage()
@Component({
  selector: 'page-open-conversation',
  templateUrl: 'open-conversation.html'
})
export class OpenConversationPage {
  @ViewChild('content') content: any;
  user: User;
  cid: string;
  conversation: Conversation;
  messageContent: string;
  messages: Message[] = [];
  

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: Database, public firebase: AngularFirestore) {
    this.user = navParams.get('user');
    this.cid = navParams.get('cid');
    this.conversation = this.user.conversations[this.cid];
    this.loadMessages();
  }  

  loadMessages() {    
    this.db.loadMessages(this.cid,this.user.uid,this.receiveMessages,this);
    //this.scrollToBottom();
  }

  sendMessage() {
    if (this.messageContent == "") return;
    let message = {
      "uid":this.user.uid,
      "name":this.user.displayName,
      "content":this.messageContent,
      "timestamp": firebase.firestore.FieldValue.serverTimestamp() } as Message;
    this.db.sendMessage(this.cid,message);
    this.messageContent = "";
  }

  receiveMessages(messages: Message[],page: OpenConversationPage) {
    page.messages = page.messages.concat(messages);
    page.scrollToBottom(page);
  } 

  scrollToBottom(page: OpenConversationPage){
    setTimeout(() => {
      page.content.scrollToBottom(400);
    });
  } 
}
