import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateConversationPage } from '../create-conversation/create-conversation';
import { User } from '../../model/user';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';


@IonicPage()
@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {
  user: User;
  cids: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: AngularFirestore) {
    this.user = navParams.get('user');
    this.user.conversations = {};
    this.cids = Object.keys;
    this.loadConversations();
    console.log(this.user);
  }

  createConversation(){
    this.navCtrl.push(CreateConversationPage, {
      user: this.user
    });
  }

  loadConversations() {
    let self = this;
    self.db.collection('users').doc(self.user.uid).collection('conversations').ref.get()
    .then(function(querySnapshot) {
      // Get user's conversation ids
      querySnapshot.forEach(function(doc) {
        // Get conversation object
        self.db.collection('conversations').doc(doc.id).ref.get()
        .then(function(doc) {
          self.user.conversations[doc.id] = doc.data();
        }).catch(function(e){
          console.error(e);
        })
      });
      console.log(self.user.conversations);
    }).catch(function(e) {
      console.error(e);
    })
  }
}
