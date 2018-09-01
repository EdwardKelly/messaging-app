import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Storage } from '../../helper/storage';
import { User } from '../../entity/user';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  user: User;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public camera: Camera, public storage: Storage) {
      this.user = navParams.get('user');
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
    let image = await this.camera.getPicture(options);
    const filepath = 'user_profile_images/'+this.user.uid+'.png';
    
    this.storage.uploadImage(image,filepath)
  }

}
