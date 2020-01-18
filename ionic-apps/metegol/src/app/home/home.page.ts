import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service'
import { ModalController, ActionSheetController, Events } from '@ionic/angular'
import { Router } from '@angular/router';
import { DataService } from '../servicios/data.service';
import { usuario } from '../modelos/usuario';
import { partido } from '../modelos/partido'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public personaje = null;
  btnIniciar: HTMLButtonElement;
  usuario: usuario = null;
  usuarioEmail: any;
  usuarioUid: any;
  partidosPendientes: partido[];
  partidosTerminados: partido[];
  partidosType: any;

  constructor(
    public events: Events,
    private dataServ: DataService,
    public router: Router,
    public Afauth: AuthService,
    public actionSheetController: ActionSheetController) {
    this.partidosType = 'terminados'
  }

  ngOnInit() {
    this.events.subscribe('usuarioLogueado', data => {
      this.usuarioEmail = data.user.email;
      this.usuarioUid = data.user.uid;
      localStorage.setItem("usuarioUid", this.usuarioUid)
      console.log(this.usuarioUid)
    })
    this.dataServ.getPartidos().subscribe(res => {
      this.partidosPendientes = res.filter(el => { return el.ganador == "" })
      this.partidosTerminados = res.filter(el => { return el.ganador != "" })
    })
  }

  public ionViewDidEnter() {
    if (localStorage.getItem("usuarioUid") != null) {
      this.usuarioUid = localStorage.getItem("usuarioUid");
      console.log("this.usuarioUid lS", this.usuarioUid)
    }
  }

  OnLogOut() {
    this.Afauth.logout();
  }

  elegir(tipo) {
    this.personaje = tipo;
    this.btnIniciar.disabled = false;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Desconectarse',
        role: 'destructive',
        icon: 'log-out',
        handler: () => {
          this.OnLogOut();
        },
      },
      {
        text: 'Listado de los mejores cinco',
        role: 'destructive',
        icon: 'list',
        handler: () => {
          this.router.navigate(['list']);
        },
      }]
    });
    await actionSheet.present();
  }
}
