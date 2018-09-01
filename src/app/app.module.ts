import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, Injectable } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFirestoreModule } from "angularfire2/firestore"

import { MyApp } from './app.component';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ConversationsPage, PopoverPage } from '../pages/conversations/conversations';
import { OpenConversationPage } from '../pages/open-conversation/open-conversation';
import { CreateConversationPage } from '../pages/create-conversation/create-conversation';
import { Alert } from '../helper/alert';
import { Authentication } from '../helper/authentication';
import { Database } from '../helper/database';
import { SettingsPage } from '../pages/settings/settings';
import { Camera } from '../../node_modules/@ionic-native/camera';
import { Storage } from '../helper/storage';
import { SettingsProvider } from '../providers/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ConversationsPage,
    CreateConversationPage,
    OpenConversationPage,
    PopoverPage,
    SettingsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ConversationsPage,
    CreateConversationPage,
    OpenConversationPage,
    PopoverPage,
    SettingsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Alert,
    Authentication,
    Database,
    Camera,
    Storage,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SettingsProvider
  ]
})
export class AppModule {}
