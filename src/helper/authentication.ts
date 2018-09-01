import { AngularFireAuth } from "angularfire2/auth";
import { Injectable } from "@angular/core";

/**
 * Class to help with authentication
 */

@Injectable()
export class Authentication {

  constructor (private afAuth: AngularFireAuth) {

  }

  async signup(user,password) {
    let self = this;
    // Create account
    return this.afAuth.auth.createUserWithEmailAndPassword(
      user.email, password
    ).then(function() {
      // Set display name
      let currentUser = self.afAuth.auth.currentUser
      user.uid = currentUser.uid;
      return currentUser.updateProfile({
        displayName: user.displayName,
        photoURL: null
      })
    }).then(function(){
      return user;
    })
  }

  async login(user, password){ 
    let self = this;
    return this.afAuth.auth.signInWithEmailAndPassword(
      user.email, password
    ).then(function() {
      let currentUser = self.afAuth.auth.currentUser;
      user.uid = currentUser.uid;
      user.displayName = currentUser.displayName;
      return user;
    })
  }
}