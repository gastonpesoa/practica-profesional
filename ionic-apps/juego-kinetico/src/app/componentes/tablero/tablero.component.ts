import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { CountupTimerService } from 'ngx-timer'
import { countUpTimerConfigModel, timerTexts } from 'ngx-timer';
import { diccionario } from 'src/app/modelos/diccionario';
import { Heroe } from 'src/app/modelos/heroe';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { ToastService } from 'src/app/servicios/toast.service';
import { DataService } from 'src/app/servicios/data.service';


@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss'],
})
export class TableroComponent implements OnInit {

  personaje: any;
  userMail: string;
  testConfig: countUpTimerConfigModel;
  heroe: Heroe;
  options = { frequency: 100 };
  subscription: any;
  heroView: HTMLButtonElement;
  perdio: boolean = false;
  uid: String;
  record: number;

  constructor(
    private dataServ: DataService,
    private toast: ToastService,
    private deviceMotion: DeviceMotion,
    private countupTimerService: CountupTimerService,
    private navParams: NavParams,
    private modal: ModalController,
    private authService: AuthService) { }

  ngOnInit() {
    this.configTimer();
    this.countupTimerService.startTimer();
    this.heroView = (document.getElementById('heroe') as HTMLButtonElement);
    this.personaje = this.navParams.get('heroe');
    this.setHeroe();
    this.userMail = this.authService.getCurrentUserMail();
    this.uid = this.authService.getCurrentUserId();
    this.dataServ.getUsuarioByUid(this.uid).subscribe(res => {
      console.log("res", res)
      this.record = res[0].record
      console.log("record", this.record)
    })
    // console.log(this.countupTimerService.timerValue)
  }

  public ionViewDidEnter() {
    setTimeout(()=>{
      this.watchAcceleration();
    }, 500)
  }

  public ionViewDidLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.stop();
    }
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
        this.determineAction(acceleration);
      });
  }

  stop() {
    // Stop watch
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  determineAction(acceleration) {

    var topMove = 200
    var leftMove = 125

    var xPos = Math.round(acceleration.x * 5)
    var yPos = Math.round(acceleration.y * 7)

    var yMove = Math.pow(yPos, 2)
    var xMove = Math.pow(xPos, 2)

    if (yPos < 0)
      yMove = 0 - yMove
    if (xPos < 0)
      xMove = 0 - xMove

    topMove += yMove
    leftMove -= xMove

    // console.log("topMove", topMove)
    // console.log("leftMove", leftMove)

    if (topMove < 0) {
      this.stop();
      this.perdio = true
      topMove = -4;
    }
    if (topMove > 482) {
      this.stop();
      this.perdio = true
      topMove = 482
    }
    if (leftMove < 0) {
      this.stop();
      this.perdio = true
      leftMove = -4;
    }
    if (leftMove > 229) {
      this.stop();
      this.perdio = true
      leftMove = 229
    }

    this.heroView.style.top = topMove.toString() + 'px'
    this.heroView.style.left = leftMove.toString() + 'px'

    if (this.perdio) {
      this.gameOver()
    }
  }

  gameOver() {
    var minToSeg = 0;
    this.countupTimerService.pauseTimer();
    var min = parseInt(this.countupTimerService.timerValue.mins)
    if(min > 0) {
      minToSeg = min * 60;
    }
    var segundos = minToSeg + parseInt(this.countupTimerService.timerValue.seconds)
    if (segundos > this.record) {
      this.dataServ.updateDatabase(this.uid, segundos, this.heroe.nombre)
      this.toast.confirmationToast("Nuevo record! " + segundos + " segundos.")
    } else {
      this.toast.errorToast("Duraste " + segundos + " segundos.")
    }
    this.closeModal();
  }

  configTimer() {
    //countUpTimerConfigModel
    this.testConfig = new countUpTimerConfigModel();
    //custom class
    this.testConfig.timerClass = 'test_Timer_class';
    //timer text values
    this.testConfig.timerTexts = new timerTexts();
    this.testConfig.timerTexts.hourText = " :"; //default - hh
    this.testConfig.timerTexts.minuteText = " :"; //default - mm
    this.testConfig.timerTexts.secondsText = " "; //default - ss
  }

  setHeroe() {
    console.log("this person", this.personaje)
    this.heroe = new Heroe();
    if (this.personaje == diccionario.franquicia.Marvel) {
      this.heroe.nombre = 'Ironman'
      this.heroe.franquicia = diccionario.franquicia.Marvel
      this.heroe.imagen = "../../../assets/ironman.png"
      this.heroe.color = "red"
      this.heroe.xPos = 5
      this.heroe.yPos = 5
      console.log("this heroe marvel", this.heroe)
    } else {
      this.heroe.nombre = 'Batman'
      this.heroe.franquicia = diccionario.franquicia.DC
      this.heroe.imagen = "../../../assets/batman1.png"
      this.heroe.color = "black"
      this.heroe.xPos = 5
      this.heroe.yPos = 5
      console.log("this heroe dc", this.heroe)
    }
  }

  closeModal() {
    this.countupTimerService.stopTimer();
    this.modal.dismiss();
  }

}
