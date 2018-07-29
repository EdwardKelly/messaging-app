import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../model/user';
import { ConversationsPage } from '../conversations/conversations';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '../../../node_modules/@angular/forms';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  user = {} as User;

  form: FormGroup;
  emailField: AbstractControl;
  passwordField: AbstractControl;
  displayNameField: AbstractControl;

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public afAuth: AngularFireAuth, public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, public formBuilder: FormBuilder) {
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
      this.user.email, this.user.password
    ).then(function() {
      // Set display name
        signupPage.afAuth.auth.currentUser.updateProfile({
        displayName: signupPage.user.displayName,
        photoURL: null
      }).then(function() {
        signupPage.loading.dismiss();
        signupPage.displaySuccessMessage();
        signupPage.navCtrl.setRoot(ConversationsPage);
      }).catch(function(e) {
        throw e;
      });
    }).catch(function(e) {
      signupPage.loading.dismiss();
      signupPage.displayErrorMessage(e.message);
    })
    this.displayLoading();

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
