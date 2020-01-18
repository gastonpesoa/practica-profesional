import { Component } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { CameraService } from '../servicios/camera.service'
import { ToastService } from '../servicios/toast.service'
import { ActionSheetController, Events } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  email: string;
  urlsFoto: Array<any>;
  fotosCargadas: boolean = false;

  constructor(
    private router: Router,
    private Afauth: AuthService,
    public actionSheetController: ActionSheetController) {
  }

  ngOnInit(){
    this.urlsFoto = new Array<any>();
    this.email = this.Afauth.getCurrentUserMail();
  }

  OnLogOut() {
    this.Afauth.logout();
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Galería',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/galeria']);
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
