import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { User } from '../../entity/user';
import { ConversationsPage } from '../conversations/conversations';
import { FormBuilder, AbstractControl, FormGroup, Validators } from '@angular/forms';
import { Database } from '../../helper/database';
import { Authentication } from '../../helper/authentication';
import { Alert } from '../../helper/alert';



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
    public auth: Authentication, public db: Database, 
    public alert: Alert, public formBuilder: FormBuilder) {
      this.user.conversations = {};
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
    let self = this;
    this.alert.displayLoading("Signing up...");
    // Sign up user with authentication
    this.auth.signup(this.user,this.password)
    // Add user to database
    .then(function(user) {
      self.user = user;
      self.db.addUser(self.user);
    })
    // Switch to next page
    .then(function() {
      self.alert.dismissLoading();
      self.navCtrl.setRoot(ConversationsPage, {
        user: self.user
      });
    }).catch(function(e){
      self.alert.dismissLoading();
      self.alert.displayOkMessage("Sign up failed",e.message);
    });
  }
}
