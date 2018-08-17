import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../model/user';
import { ConversationsPage } from '../conversations/conversations';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '../../../node_modules/@angular/forms';
import { AngularFirestore } from '../../../node_modules/angularfire2/firestore';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user = {} as User;
  password :string;

  form: FormGroup;
  emailField: AbstractControl;
  passwordField: AbstractControl;
  displayNameField: AbstractControl;

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public afAuth: AngularFireAuth, public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, public formBuilder: FormBuilder,
    public db: AngularFirestore) {
    this.buildForm(formBuilder);
  }

  buildForm(formBuilder) {
    this.form = formBuilder.group({
      emailField: ['', [Validators.required, Validators.email]],
      passwordField: ['', Validators.required],
      displayNameField: ['', Validators.required]
    });
    this.emailField = this.form.controls['emailField'];
    this.passwordField = this.form.controls['passwordField'];
    this.displayNameField = this.form.controls['displayNameField'];
  }

  signup() {
    var signupPage: SignupPage = this;
    // Create account
    this.afAuth.auth.createUserWithEmailAndPassword(
      this.user.email, this.password
    ).then(function() {
      // Set display name
      var currentUser = signupPage.afAuth.auth.currentUser
      currentUser.updateProfile({
        displayName: signupPage.user.displayName,
        photoURL: null
      }).then(function() {
        signupPage.addUserToDatabase();
      }).catch(function(e) {
        throw e;
      });
      signupPage.user.uid = currentUser.uid;
    }).catch(function(e) {
      signupPage.loading.dismiss();
      signupPage.displayErrorMessage(e.message);
    })
    this.displayLoading();
  }

  addUserToDatabase() {
    var signupPage: SignupPage = this;
    this.db.collection("users").doc(this.user.uid).set({
      email: this.user.email,
      displayName: this.user.displayName
    }).then(function() {
      console.log("user added to database");
      signupPage.loading.dismiss();
      signupPage.displaySuccessMessage();
      signupPage.navCtrl.setRoot(ConversationsPage, {
        user: signupPage.user
      });
    }).catch(function(e) {
      console.log("could not write to database")
      signupPage.loading.dismiss();
      signupPage.displayErrorMessage(e.message);
    })
  }

  displaySuccessMessage() {
    let alert = this.alertCtrl.create({
      title: 'Sign up successful',
      subTitle: 'Welcome to Messaging App ' + this.user.displayName,
      buttons: ['OK']
    });
    alert.present();
  }

  displayErrorMessage(message) {
    let alert = this.alertCtrl.create({
      title: 'Sign up failed',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();    
  }

  displayLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Signing up...'
    });
    this.loading.present();
  }
}
