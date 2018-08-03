import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Conversation } from '../../model/conversation';
/**
 * Generated class for the CreateConversationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-conversation',
  templateUrl: 'create-conversation.html',
})
export class CreateConversationPage {
  conversation = {} as Conversation;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
