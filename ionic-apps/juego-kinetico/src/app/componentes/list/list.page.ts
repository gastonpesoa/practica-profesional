import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { DataService } from 'src/app/servicios/data.service';
import { usuario } from '../../modelos/usuario'

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  listado: usuario[];

  constructor(public router: Router,
    public dataServ: DataService,
    public Afauth: AuthService,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.dataServ.getUsuarios().subscribe(res => {
      console.log("res", res)
      this.listado = res.slice(0, 3);
    })
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
