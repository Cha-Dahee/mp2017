import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { EditMeetingInfoPage} from '../pages/edit-meeting-info/edit-meeting-info';
import { EditMeetingRulePage} from '../pages/edit-meeting-rule/edit-meeting-rule';

import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';

export const firebaseConfig = {
  apiKey: "AIzaSyBaK_t5ngY0MZlIQW42ygjCCGDFJL--Er0",
  authDomain: "meetinghandler.firebaseapp.com",
  databaseURL: "https://meetinghandler.firebaseio.com",
  projectId: "meetinghandler",
  storageBucket: "meetinghandler.appspot.com",
  messagingSenderId: "580575550249"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EditMeetingInfoPage,
    EditMeetingRulePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EditMeetingInfoPage,
    EditMeetingRulePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
