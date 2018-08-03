import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateConversationPage } from '../create-conversation/create-conversation';

/**
 * Generated class for the ConversationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  createConversation(){
    this.navCtrl.push(CreateConversationPage)
  }
}
