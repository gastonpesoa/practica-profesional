import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireStorageModule } from '@angular/fire/storage'
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularFirestoreModule } from '@angular/fire/firestore'
import { AngularFireModule } from '@angular/fire'
import { AngularFireAuthModule } from '@angular/fire/auth'
import { firebaseConfig } from '../environments/environment'

import { NgxTimerModule } from 'ngx-timer';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { TableroComponent } from './componentes/tablero/tablero.component'

@NgModule({
  declarations: [AppComponent, TableroComponent],
  entryComponents: [TableroComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig), AngularFireAuthModule,
    AngularFirestoreModule, AngularFireDatabaseModule, AngularFireStorageModule, NgxTimerModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    DeviceMotion
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
