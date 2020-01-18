import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/servicios/data.service';
import { Observable } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { imagen } from '../../modelos/imagen';
import { AuthService } from 'src/app/servicios/auth.service';
import { ToastService } from 'src/app/servicios/toast.service';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  public files: any = [];
  email: string;
  todas: boolean = true;
  lindas: boolean = false;
  feas: boolean = false;

  constructor(
    private authService: AuthService,
    private dataServ: DataService,
    public actionSheetController: ActionSheetController,
    private router: Router,
    private toast: ToastService) {
  }

  ngOnInit() {
    this.dataServ.getImages().subscribe(files => {
      console.info("files: ", files);
      this.setTipoVoto(files);
      this.files = files;
      this.email = this.authService.getCurrentUserMail();
    });
  }

  setTipoVoto(files) {
    files.forEach(file => {
      console.info("file ", file);
      file.votos.forEach(voto => {
        if (voto === this.authService.getCurrentUserMail()) {
          console.info("a esta ya voto ", this.authService.getCurrentUserMail())
          file.votado = true;
        }
      });
    });
  }

  votar(id) {
    let fileId = this.files.find(x => x.id == id);
    let userEmail = this.authService.getCurrentUserMail();
    console.info("user email", userEmail);
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

  traer(por: number) {
    switch (por) {
      case 0:
        this.lindas = false;
        this.feas = false;
        this.todas = true;
        this.dataServ.getImages().subscribe(files => {
          console.info("files: ", files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break;
      case 1:
        this.lindas = true;
        this.feas = false;
        this.todas = false;
        this.dataServ.getByTipo(1).subscribe(files => {
          console.info("files: ", files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break;
      case 2:
        this.lindas = false;
        this.feas = true;
        this.todas = false;
        this.dataServ.getByTipo(2).subscribe(files => {
          console.info("files: ", files);
          this.setTipoVoto(files);
          this.files = files;
        });
        break
    }
  }

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
