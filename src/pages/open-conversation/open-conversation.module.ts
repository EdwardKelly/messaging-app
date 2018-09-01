import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OpenConversationPage } from './open-conversation';

@NgModule({
  declarations: [
    OpenConversationPage,
  ],
  imports: [
    IonicPageModule.forChild(OpenConversationPage),
  ],
})
export class OpenConversationPageModule {}
