import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/servicios/data.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { NavParams, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';

@Component({
  selector: 'app-mis-direcciones',
  templateUrl: './mis-direcciones.component.html',
  styleUrls: ['./mis-direcciones.component.scss'],
})
export class MisDireccionesComponent implements OnInit {
  userMail: string;
  uid: string;
  alarmas: any[] = [];

  constructor(private dataServ: DataService,
    private toast: ToastService,
    private navParams: NavParams,
    private modal: ModalController,
    private authService: AuthService) { }

  ngOnInit() {
    this.userMail = this.authService.getCurrentUserMail();
    this.uid = this.authService.getCurrentUserId();
    this.getMisDirecciones()
  }

  closeModal(alarma) {
    if (alarma) {
      this.modal.dismiss({
        alarma: alarma
      });
    } else {
      this.modal.dismiss()
    }
  }

  getMisDirecciones(){
    this.dataServ.getUsuarioByUid(this.uid).subscribe(res => {
      console.log(res)
      this.alarmas = res[0].alarma
    })
  }

  seleccionar(item){
    console.log(item)
    this.closeModal(item)
  }

}
