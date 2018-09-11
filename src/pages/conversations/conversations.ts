import { Component, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ViewController } from 'ionic-angular';
import { CreateConversationPage } from '../create-conversation/create-conversation';
import { User } from '../../entity/user';
import { Database } from '../../helper/database';
import { OpenConversationPage } from '../open-conversation/open-conversation';
import { LoginPage } from '../login/login';


@IonicPage()
@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {
  user: User;
  cids: Object;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: Database, public popoverCtrl: PopoverController) {
    this.user = navParams.get('user');
    this.cids = Object.keys;
  }

  createConversation(){
    this.navCtrl.push(CreateConversationPage, {
      user: this.user
    });
  }

  openConversation(cid){
    this.navCtrl.push(OpenConversationPage, {
      user: this.user,
      cid: cid
    });
  }

  presentPopover(event) {
    let self = this;
    let popover = this.popoverCtrl.create(PopoverPage,{
      logout: function() {
        self.navCtrl.setRoot(LoginPage);
      }
    });

    popover.present({
      ev: event
    });
  }

}

// Popover menu

@Component({
  template: `
    <ion-list>
      <button ion-item (click)="logout()">Log out</button>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public navCtrl: NavController,
  public params: NavParams) {}

  logout() {
    this.viewCtrl.dismiss();
    this.params.get('logout')();
  }
}
