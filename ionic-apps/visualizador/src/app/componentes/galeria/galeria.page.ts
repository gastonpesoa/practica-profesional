import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonSlides } from '@ionic/angular';
import { Router } from '@angular/router';

import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';

import { DataService } from 'src/app/servicios/data.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { ToastService } from 'src/app/servicios/toast.service';


@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  @ViewChild('slides', { static: true }) slides: IonSlides;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  public files: any = [];
  email: string;
  todas: boolean = true;
  lindas: boolean = false;
  feas: boolean = false;
  subscription: any;
  options = { frequency: 2000 };  // Update every 2 seconds
  verticalFlag: boolean;
  horizontalFlag: boolean;
  izquierdaFlag: boolean;
  derechaFlag: boolean;

  constructor(
    private deviceMotion: DeviceMotion,
    private authService: AuthService,
    private dataServ: DataService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private toast: ToastService) {
  }

  ngOnInit() {
    this.dataServ.getImages().subscribe(files => {
      this.setTipoVoto(files);
      this.files = files;
      this.email = this.authService.getCurrentUserMail();
    });
  }

  public ionViewDidEnter() {
    this.watchAcceleration();
  }

  public ionViewDidLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.stop();
    }
  }

  setTipoVoto(files) {
    files.forEach(file => {
      // console.info("file ", file);
      file.votos.forEach(voto => {
        if (voto === this.authService.getCurrentUserMail()) {
          // console.info("a esta ya voto ", this.authService.getCurrentUserMail())
          file.votado = true;
        }
      });
    });
  }

  votar(id) {
    let fileId = this.files.find(x => x.id == id);
    let userEmail = this.authService.getCurrentUserMail();
    // console.info("user email", userEmail);
    if (fileId.votado) {
      var position = fileId.votos.indexOf(userEmail);
      if (position)
        fileId.votos.splice(position, 1)
    }
    else
      fileId.votos.push(userEmail);
    this.dataServ.updateDatabase(id, fileId.votos)
      .then(res => {
        this.toast.confirmationToast("Voto registrado")
      })
      .catch(err => {
        this.toast.errorToast("Error: " + err.message + " al intentar registrar voto")
      });
  }

  OnLogOut() {
    this.authService.logout();
  }

  cambiaSlide(){}

  traer(por: number) {
    switch (por) {
      case 0:
        this.lindas = false;
        this.feas = false;
        this.todas = true;
        this.dataServ.getImages().subscribe(files => {
          // console.info("files: ", files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break;
      case 1:
        this.lindas = true;
        this.feas = false;
        this.todas = false;
        this.dataServ.getByTipo('linda').subscribe(files => {
          // console.info("files: ", files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break;
      case 2:
        this.lindas = false;
        this.feas = true;
        this.todas = false;
        this.dataServ.getByTipo('fea').subscribe(files => {
          // console.info("files: ", files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break
    }
    this.slides.slideTo(0);
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

  determineAction(acceleration) {
    if (acceleration.y < 5 && acceleration.x < 5 && acceleration.z > 5 ) {
      this.movVertical();
    }
    if (acceleration.x > 5 && acceleration.y < 5 && acceleration.z > -5) {
      this.movIzquierda();
    }
    if (acceleration.x < -5 && acceleration.y < 5 && acceleration.z > -5) {
      this.movDerecha();
    }
    // if (acceleration.y < 5 && acceleration.x < 5 && acceleration.z > 5 && this.horizontalFlag) {
    //   this.movHorizontal();
    // }
  }

  movVertical() {
    this.verticalFlag = true;
    this.horizontalFlag = true;
    this.slides.slideTo(0);
  }

  movIzquierda() {
    this.izquierdaFlag = true;
    this.horizontalFlag = true;
    this.slides.slidePrev();
  }

  movDerecha() {
    this.derechaFlag = true;
    this.horizontalFlag = true;
    this.slides.slideNext();
  }

  // movHorizontal() {
  //   this.horizontalFlag = false;
  // }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Home',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/home']);
          }
        },
        {
          text: 'Desconectarse',
          role: 'destructive',
          icon: 'log-out',
          handler: () => {
            this.OnLogOut();
          },
        }
      ]
    });
    await actionSheet.present();
  }

}
