import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Conversation } from '../../entity/conversation';
import { User } from '../../entity/user';
import { ConversationsPage } from '../conversations/conversations';
import { Database } from '../../helper/database';
import { Alert } from '../../helper/alert';
import { Camera, CameraOptions } from '../../../node_modules/@ionic-native/camera';
import { Storage } from '../../helper/storage';

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
  image = null;
  imageSelected = "none";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public db: Database, public alert: Alert, public camera: Camera,
    public storage: Storage) {
    this.user = navParams.get('user');
    this.conversation.memberIds = [];
    this.conversation.memberIds.push(this.user.uid);
  }

  addMember() {
    let self = this;
    if (self.emails.indexOf(self.newEmail) != -1 && self.newEmail == "")return; 

    self.db.getUserByEmail(self.newEmail)
    .then(function(querySnapshot) {
      if (querySnapshot.empty) {
        self.alert.displayOkMessage("Email does not exist",self.newEmail+" is not registered")          
        self.newEmail = "";
      } else {
        querySnapshot.forEach(function(doc) {          
          self.conversation.memberIds.push(doc.id);  
          self.emails.push(self.newEmail);     
          self.newEmail = "";
        });
      }
    }).catch(function(e) {
      self.alert.displayOkMessage("Could not add member",e.message);
    });
  }

  async chooseImage(){
    const options: CameraOptions = {
      quality: 50,
      targetHeight: 100,
      targetWidth: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.image = await this.camera.getPicture(options);
    this.imageSelected = "image selected";
  }

  createConversation() {
    var self = this;
    self.alert.displayLoading("");
    self.db.createConversation(self.conversation)
    .then(async function(conversation){
      self.user.conversations[conversation.cid] = conversation;
      if (self.image != null) {
        // Upload conversation image
        const filepath = 'conversation_images/'+conversation.cid+'.png';
        await self.storage.uploadImage(self.image,filepath);
        conversation.imageURL = await self.storage.downloadImage('conversation_images/'+conversation.cid+'.png');
      }
      self.alert.dismissLoading();
      self.navCtrl.setRoot(ConversationsPage, {
        user: self.user
      });
    }).catch(function(e){
      self.alert.displayOkMessage("Error creating conversation",e.message);
    });
  }

}
