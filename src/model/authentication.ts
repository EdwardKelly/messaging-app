import { AngularFireAuth } from "../../node_modules/angularfire2/auth";
import { User } from './user';

/**
 * Class to help with authentication
 */

export class Authentication {

  constructor (public afAuth: AngularFireAuth, public user: User, public password: string) {

  }

  signup() {
    var authentication: Authentication = this;
    // Create account
    this.afAuth.auth.createUserWithEmailAndPassword(
      this.user.email, this.password
    ).then(function() {
      // Set display name
      var currentUser = authentication.afAuth.auth.currentUser
      currentUser.updateProfile({
        displayName: authentication.user.displayName,
        photoURL: null
      }).then(function() {
        return authentication.user;
      }).catch(function(e) {
        throw e;
      });
      authentication.user.uid = currentUser.uid;
    }).catch(function(e) {
      throw e;
    })
  }
}