import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Conversation } from '../../model/conversation';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';
import { User } from '../../model/user';
import firebase from '../../../node_modules/firebase';
import { ConversationsPage } from '../conversations/conversations';

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
    let self = this;
    if (self.emails.indexOf(self.newEmail) == -1 && self.newEmail != "") {

        
      self.db.collection('users').ref.where("email", "==", self.newEmail).get()
        .then(function(querySnapshot) {
          if (querySnapshot.empty) {
            console.log("User does not exist");            
            self.newEmail = "";
          } else {
            querySnapshot.forEach(function(doc) {
              console.log(doc.id+":="+doc.data().email);            
              self.conversation.memberIds.push(doc.id);  
              self.emails.push(self.newEmail);     
              self.newEmail = "";
            });
          }
        }).catch(function(e) {
          console.error(e);
        });
    }
  }

  createConversation() {
    var self = this;
    // create new conversation with name and members
    self.db.collection('conversations').add({
      name: self.conversation.name
    }).then(function(docRef){
      console.log(docRef);
      self.conversation.cid = docRef.id;
      // Add members
      for (let uid of self.conversation.memberIds) {
        self.db.collection('conversations').doc(docRef.id)
        .collection('members').doc(uid).set({})
        .then(function(docRef){
          console.log(docRef);
        }).catch(function(e) {
          console.error(e);
        });
      }
      // Add conversation to members
      for (let uid of self.conversation.memberIds) {
        self.db.collection('users').doc(uid)
          .collection('conversations').doc(self.conversation.cid).set({})
        .then(function(docRef){
          console.log(docRef);
          self.navCtrl.setRoot(ConversationsPage, {
            user: self.user
          });
        }).catch(function(e) {
          console.error(e);
        });
      }
    }).catch(function(e) {
      console.error(e);
    });

  }

}
