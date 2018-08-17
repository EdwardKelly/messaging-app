import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { User } from '../../model/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { SignupPage } from '../signup/signup';
import { ConversationsPage } from '../conversations/conversations';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '../../../node_modules/@angular/forms';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user = {} as User;
  password: string;

  form: FormGroup;
  emailField: AbstractControl;
  passwordField: AbstractControl;

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public afAuth: AngularFireAuth, public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController, public formBuilder: FormBuilder) {
      this.buildForm(formBuilder);
  }

  buildForm(formBuilder) {
    this.form = formBuilder.group({
      emailField: ['', [Validators.required, Validators.email]],
      passwordField: ['', Validators.required]
    });
    this.emailField = this.form.controls['emailField'];
    this.passwordField = this.form.controls['passwordField'];
  }

  signup(){
    this.navCtrl.push(SignupPage)
  }

  login(){ 
    var loginPage: LoginPage = this;
    // Create account
    this.afAuth.auth.signInWithEmailAndPassword(
      this.user.email, this.password
    ).then(function() {
      var currentUser = loginPage.afAuth.auth.currentUser;
      loginPage.user.uid = currentUser.uid;
      loginPage.user.displayName = currentUser.displayName;

      loginPage.loading.dismiss();
      loginPage.displaySuccessMessage();
      loginPage.navCtrl.setRoot(ConversationsPage, {
        user: loginPage.user
      });
    }).catch(function(e) {
      loginPage.loading.dismiss();
      loginPage.displayErrorMessage(e.message);
    })
    this.displayLoading();
  }
  
  displaySuccessMessage() {
    let alert = this.alertCtrl.create({
      title: 'Log in successful',
      subTitle: 'Welcome ' + this.user.displayName,
      buttons: ['OK']
    });
    alert.present();
  }

  displayErrorMessage(message) {
    let alert = this.alertCtrl.create({
      title: 'Log in failed',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();    
  }

  displayLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Logging in...'
    });
    this.loading.present();
  }
}
