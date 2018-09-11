import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../entity/user';
import { SignupPage } from '../signup/signup';
import { ConversationsPage } from '../conversations/conversations';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '../../../node_modules/@angular/forms';
import { Authentication } from '../../helper/authentication';
import { Alert } from '../../helper/alert';
import { Database } from '../../helper/database';
import { Storage } from '../../helper/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  selectedTheme: String;

  user = {} as User;
  password: string;

  form: FormGroup;
  emailField: AbstractControl;
  passwordField: AbstractControl;

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public formBuilder: FormBuilder, public auth: Authentication,
    public db: Database, public alert: Alert, public storage: Storage) {
      this.buildForm(formBuilder);
  }
  
  // Used for checking inputs are valid
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

  login() {    
    let self = this;
    this.alert.displayLoading("Logging in...");
    this.auth.login(this.user, this.password)
    .then(async function(user) {
      return await self.db.loadUser(user);
    }).then(async function(user){
      for (let cid in user.conversations){
        let imageURL = await self.storage.downloadImage('conversation_images/'+cid+'.png');
        user.conversations[cid].imageURL = imageURL;
      }
      return user;
    })    
    .then(function(user){
      self.user = user;  
      self.alert.dismissLoading();
      self.navCtrl.setRoot(ConversationsPage, {
        user: self.user
      });
    }).catch(function(e){
      self.alert.dismissLoading();
      self.alert.displayOkMessage("Log in failed",e.message);
    })
  }
}
