import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/servicios/data.service';
import { ActionSheetController, Events } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/servicios/auth.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { partido } from '../../modelos/partido'
import { CamaraService } from '../../servicios/camara.service'


@Component({
  selector: 'app-cargar-resultados',
  templateUrl: './cargar-resultados.page.html',
  styleUrls: ['./cargar-resultados.page.scss'],
})
export class CargarResultadosPage implements OnInit {

  partidos: partido[];
  jugadorUnoResultado: any = null;
  jugadorDosResultado: any = null;
  mostrarInputs: boolean = false;
  numeroPartido: any;
  partidoSeleccionado: partido;
  ganador: string;

  constructor(
    private camServ: CamaraService,
    private toast: ToastService,
    public Afauth: AuthService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private dataServ: DataService) { }

  ngOnInit() {
    this.traerPartidos()
  }

  traerPartidos() {
    this.dataServ.getPartidos().subscribe(res => {
      console.log(res)
      this.partidos = res.filter(el => { return el.ganador == "" });
    })
  }

  tomarFoto() {
    this.camServ.takePhoto()
      .then(imageData => {
        if (imageData !== 'No Image Selected') {
          this.subirFoto(imageData);
        } else {
          this.toast.errorToast('No tomó la foto.');
        }
      })
      .catch(error => {
        this.toast.errorToast('Error: No se ha podido cargar la foto. ' + error.message);
      });
  }

  subirFoto(imageData) {
    this.camServ.uploadPhoto(imageData, this.partidoSeleccionado)
      .then(() => {
        // this.toast.confirmationToast("Foto guardada")
      })
      .catch(err => {
        this.toast.errorToast('Error: No se ha podido guardar la foto. ' + err.message);
      })
  }

  verificarGanador() {
    if (this.jugadorUnoResultado != null && this.jugadorDosResultado != null) {
      if (this.jugadorUnoResultado > this.jugadorDosResultado) {
        this.ganador = this.partidoSeleccionado.jugadorUno
      } else {
        this.ganador = this.partidoSeleccionado.jugadorDos
      }
    } else {
      this.ganador = null
    }
  }

  cargar(partido: partido, i) {
    this.partidoSeleccionado = partido;
    this.numeroPartido = i + 1
    this.mostrarInputs = true;
    console.log(partido)
  }

  guardar() {

    if (this.jugadorUnoResultado == null || this.jugadorDosResultado == null) {
      this.toast.errorToast("Cargá un resultado")
    } else {
      this.partidoSeleccionado.jugadorUnoResultado = this.jugadorUnoResultado
      this.partidoSeleccionado.jugadorDosResultado = this.jugadorDosResultado
      this.partidoSeleccionado.ganador = this.ganador;
      this.dataServ.updateDatabase(this.partidoSeleccionado.id, this.partidoSeleccionado)
        .then(res => {
          this.jugadorUnoResultado = null;
          this.jugadorDosResultado = null;
          this.mostrarInputs = false;
          this.numeroPartido = null;
          this.partidoSeleccionado = null;
          this.ganador = null;
          this.mostrarInputs = false;
          this.toast.confirmationToast("Resultado registrado")
        })
        .catch(err => {
          console.log(err)
          this.toast.errorToast("Error al grabar")
        })
    }
  }

  OnLogOut() {
    this.Afauth.logout();
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
