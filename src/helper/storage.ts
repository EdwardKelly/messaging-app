import firebase from '../../node_modules/firebase';
import { Injectable } from '../../node_modules/@angular/core';


@Injectable()
export class Storage {

  constructor () {

  }

  uploadImage(image,filepath) {
    var ref = firebase.storage().ref().child(filepath);
    return ref.putString(image,'base64',{contentType:'image/png'}).then(function(snapshot) {
      console.log("image added");
    })
  }

  downloadImage(filepath) {    
    var ref = firebase.storage().ref().child(filepath);
    var refDefault = firebase.storage().ref().child('conversation_images/default.png');
    return ref.getDownloadURL().catch(function(e){
      return refDefault.getDownloadURL();
    });
  }

}