import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateConversationPage } from '../create-conversation/create-conversation';
import { User } from '../../model/user';


@IonicPage()
@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {
  user: User;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.user = navParams.get('user');
    console.log(this.user);
  }

  createConversation(){
    this.navCtrl.push(CreateConversationPage, {
      user: this.user
    });
  }
}
