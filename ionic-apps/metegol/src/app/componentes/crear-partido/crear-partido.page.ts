import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/servicios/data.service';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { DocumentReference } from '@angular/fire/firestore';


@Component({
  selector: 'app-crear-partido',
  templateUrl: './crear-partido.page.html',
  styleUrls: ['./crear-partido.page.scss'],
})
export class CrearPartidoPage implements OnInit {

  fecha: any;
  primerCompetidor: any = null;
  segundoCompetidor: any = null;
  usuariosElegidos: boolean = false;
  mostrarDetalle: any = false;

  constructor(
    private toast: ToastService,
    public Afauth: AuthService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private dataServ: DataService) { }

  ngOnInit() {
    // this.fecha = this.parseDateToStringDate(new Date)
    console.log(this.fecha)
  }

  OnLogOut() {
    this.Afauth.logout();
  }

  crearPartido() {
    if (this.primerCompetidor == null || this.segundoCompetidor == null || this.fecha == null) {
      this.toast.errorToast("Completá todos los campos")
    } else {
      this.guardarPartido()
    }
  }

  guardarPartido() {
    var partido = {
      jugadorUno: this.primerCompetidor,
      jugadorDos: this.segundoCompetidor,
      fecha: this.fecha,
      ganador : ""
    }
    this.dataServ.crear('partidos', partido)
      .then((partido: DocumentReference) => {
        this.router.navigate(['/cargar-resultados'])
        this.toast.confirmationToast("Partido registrado, podés cargar el resultado del mismo");
      });
  }

  public parseDateTimeToStringDateTime(date: Date) {
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const anio = date.getFullYear();
    const hora = date.getHours();
    const minutos = date.getMinutes();
    const stringFecha: string = mes + '/' + dia + '/' + anio + ' ' + hora + ':' + minutos;
    return stringFecha;
  }

  public parseDateToStringDate(date: Date) {
    const dia = date.getDate();
    const mes = date.getMonth() + 1;
    const anio = date.getFullYear();
    const stringFecha: string = dia + '/' + mes + '/' + anio;
    return stringFecha;
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
        text: 'Inicio',
        role: 'destructive',
        icon: 'home',
        handler: () => {
          this.router.navigate(['home']);
        },
      },
      {
        text: 'Listado de los mejores cinco',
        role: 'destructive',
        icon: 'list',
        handler: () => {
          this.router.navigate(['list']);
        }
      }]
    });
    await actionSheet.present();
  }

}
