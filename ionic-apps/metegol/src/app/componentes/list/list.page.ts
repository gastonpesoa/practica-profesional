import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { DataService } from 'src/app/servicios/data.service';
import { partido } from '../../modelos/partido'

interface jugadorPuntos {
  jugador: string;
  puntos: number;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  partidos: partido[];
  usuarios: jugadorPuntos[] = [];
  lista: jugadorPuntos[];

  constructor(
    public Afauth: AuthService,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private dataServ: DataService) { }

  ngOnInit() {
    this.dataServ.getPartidos().subscribe(res => {
      this.partidos = res.filter(el => el.ganador != "")
      console.log("this.partidos", this.partidos)
    })
  }

  public ionViewDidEnter() {
    setTimeout(() => {
      this.getJugadoresPuntos(this.partidos)
    }, 900);
  }

  public ionViewDidLeave() {
    this.usuarios = []
  }

  getJugadoresPuntos(partidos: any) {

    for (let index = 0; index < partidos.length; index++) {

      const element: partido = partidos[index];

      if (index == 0) {
        if (element.ganador.toUpperCase() === element.jugadorUno.toUpperCase()) {
          this.usuarios.push({ jugador: element.jugadorUno, puntos: 1 })
          this.usuarios.push({ jugador: element.jugadorDos, puntos: 0 })
        }
        else {
          this.usuarios.push({ jugador: element.jugadorUno, puntos: 0 })
          this.usuarios.push({ jugador: element.jugadorDos, puntos: 1 })
        }
      }
      else {
        var userUno = this.usuarios.find(el => el.jugador.toUpperCase() === element.jugadorUno.toUpperCase())
        if (!userUno) {
          if (element.ganador.toUpperCase() === element.jugadorUno.toUpperCase())
            this.usuarios.push({ jugador: element.jugadorUno, puntos: 1 })
          else
            this.usuarios.push({ jugador: element.jugadorUno, puntos: 0 })
        }
        else {
          if (element.ganador.toUpperCase() === userUno.jugador.toUpperCase()) {
            userUno.puntos++
            var indiceUser = this.usuarios.map(function (e) { return e.jugador; }).indexOf(userUno.jugador);
            this.usuarios.splice(indiceUser, 1)
            this.usuarios.push({ jugador: userUno.jugador, puntos: userUno.puntos })
          }
        }
        var userDos = this.usuarios.find(el => el.jugador.toUpperCase() === element.jugadorDos.toUpperCase())
        if (!userDos) {
          if (element.ganador.toUpperCase() === element.jugadorDos.toUpperCase())
            this.usuarios.push({ jugador: element.jugadorDos, puntos: 1 })
          else
            this.usuarios.push({ jugador: element.jugadorDos, puntos: 0 })
        }
        else {
          if (element.ganador.toUpperCase() === userDos.jugador.toUpperCase()) {
            userDos.puntos++
            var indiceUser = this.usuarios.map(function (e) { return e.jugador; }).indexOf(userDos.jugador);
            this.usuarios.splice(indiceUser, 1)
            this.usuarios.push({ jugador: userDos.jugador, puntos: userDos.puntos })
          }
        }
      }
    }
    console.log("this.usuarios", this.usuarios)

    this.lista = this.usuarios.sort((a , b)=>{
      return b.puntos - a.puntos
    }).slice(0, 5)

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
      }]
    });
    await actionSheet.present();
  }

}
