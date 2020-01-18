import { Component } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { AuthService } from '../servicios/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  background;
  subscription;
  activado: boolean = false;
  epaAudio = new Audio('../../assets/sounds/epa.mp3');
  hurtandoAudio = new Audio('../../assets/sounds/hurtando.mp3');
  cronicaAudio = new Audio('../../assets/sounds/cronica.mp3')
  sirenaAudio = new Audio('../../assets/sounds/sirena.mp3')
  options = { frequency: 2000 };  // Update every 2 seconds
  flagMovido: boolean = false;
  verticalFlag: boolean = false;
  derechaFlag: boolean = false;
  izquierdaFlag: boolean = false;
  horizontalFlag: boolean = false;

  constructor(
    private deviceMotion: DeviceMotion,
    private flashlight: Flashlight,
    private vibration: Vibration,
    private auth: AuthService) {
  }

  activar() {
    this.activado = !this.activado;
    if (this.activado) {
      console.log("activado");
      this.background = '#e40d0d'
      this.watchAcceleration();
    } else {
      console.log("desactivado");
      this.background = '#fff'
      this.stop();
      this.apagarTodo();
    }
  }

  apagarTodo() {
    this.verticalFlag = false;
    this.izquierdaFlag = false;
    this.derechaFlag = false;
    this.horizontalFlag = false;
    this.flashlight.switchOff();
    this.vibration.vibrate(0);
    this.hurtandoAudio.pause();
    this.hurtandoAudio.currentTime = 0;
    this.epaAudio.pause();
    this.epaAudio.currentTime = 0;
    this.cronicaAudio.pause();
    this.cronicaAudio.currentTime = 0;
    this.sirenaAudio.pause();
    this.sirenaAudio.currentTime = 0;
  }

  determineAction(acceleration) {
    if (acceleration.y > 5 && acceleration.x < 5 && !this.verticalFlag) {
      this.apagarTodo();
      this.movVertical();
    }
    if (acceleration.x > 5 && acceleration.y < 5 && acceleration.z < 5 && !this.izquierdaFlag) {
      this.apagarTodo();
      this.movIzquierda();
    }
    if (acceleration.x < -5 && acceleration.y < 5 && acceleration.z < 5 && !this.derechaFlag) {
      this.apagarTodo();
      this.movDerecha();
    }
    if (acceleration.y < 5 && acceleration.x < 5 && acceleration.z > 5 && this.horizontalFlag) {
      this.apagarTodo();
      this.movHorizontal();
    }
  }

  movVertical() {
    this.verticalFlag = true;
    this.horizontalFlag = true;
    this.flashlight.switchOn();
    this.cronicaAudio.load();
    this.cronicaAudio.play();
    setTimeout(() => {
      this.cronicaAudio.pause();
      this.flashlight.switchOff();
    }, 5000);
  }

  movIzquierda() {
    this.izquierdaFlag = true;
    this.horizontalFlag = true;
    this.hurtandoAudio.load();
    this.hurtandoAudio.play();
  }

  movDerecha() {
    this.derechaFlag = true;
    this.horizontalFlag = true;
    this.epaAudio.load();
    this.epaAudio.play();
  }

  movHorizontal() {
    this.horizontalFlag = false;
    this.vibration.vibrate(5000);
    this.sirenaAudio.load();
    this.sirenaAudio.play();
    setTimeout(() => {
      this.sirenaAudio.pause();
    }, 5000);
  }

  // Get the device current acceleration
  getCurrentAcceleration() {
    return this.deviceMotion.getCurrentAcceleration().then(
      (acceleration: DeviceMotionAccelerationData) => console.log(acceleration),
      (error: any) => console.log(error)
    );
  }

  // Watch device acceleration
  watchAcceleration() {
    this.subscription = this.deviceMotion.watchAcceleration(this.options)
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        console.info("acc", acceleration);
        this.determineAction(acceleration);
      });
  }

  stop() {
    // Stop watch
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  logOut() {
    this.auth.logout();
  }

}
