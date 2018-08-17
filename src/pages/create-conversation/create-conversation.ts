import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Conversation } from '../../model/conversation';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { User } from '../../model/user';

@IonicPage()
@Component({
  selector: 'page-create-conversation',
  templateUrl: 'create-conversation.html',
})
export class CreateConversationPage {
  user: User
  conversation = {} as Conversation;
  newEmail: string;
  emails = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore) {
    this.user = navParams.get('user');
    this.conversation.memberIds = [];
    this.conversation.memberIds.push(this.user.uid);
  }

  addMember() {
    if (this.emails.indexOf(this.newEmail) == -1 && this.newEmail != "") {
        let createConversationPage = this;
        
        this.db.collection('users').ref.where("email", "==", this.newEmail).get()
        .then(function(querySnapshot) {
          if (querySnapshot.empty) {
            console.log("User does not exist");            
            createConversationPage.newEmail = "";
          } else {
            querySnapshot.forEach(function(doc) {
              console.log(doc.id+":="+doc.data().email);            
              createConversationPage.emails.push(createConversationPage.newEmail);
              createConversationPage.conversation.memberIds.push(doc.id);        
              createConversationPage.newEmail = "";
            });
          }
        }).catch(function(error) {
          console.error(error);
        });
    }
  }

  createConversation() {
    console.log(this.conversation);
    // add convo to members
    // create new convo with name and members
  }

}
