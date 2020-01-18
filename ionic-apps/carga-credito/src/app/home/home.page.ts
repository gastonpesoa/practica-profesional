import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { ActionSheetController } from '@ionic/angular';
import { DataService } from '../servicios/data.service';
import { ScannerService } from '../servicios/scanner.service';
import { ToastService } from '../servicios/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  email: string;
  urlsFoto: Array<any>;
  fotosCargadas: boolean = false;
  saldo: any;
  idUser: string;

  constructor(
    private toast: ToastService,
    private scanner: ScannerService,
    private dataServ: DataService,
    private router: Router,
    private Afauth: AuthService) {
  }

  ngOnInit() {
    this.idUser = this.Afauth.getCurrentUserId();
    this.email = this.Afauth.getCurrentUserMail();
    this.dataServ.getUsuarioByUid(this.idUser).subscribe(res => {
      console.log("res", res);
      this.saldo = res[0].saldo
    });
  }

  logOut() {
    this.Afauth.logout();
  }

  scan() {
    this.scanner.scan()
      .then(barcodeData => {
        console.log('Barcode data', barcodeData);
        console.log('Barcode data text', barcodeData.text);
        console.log("this.saldo", this.saldo)

        // 8c95def646b6127282ed50454b73240300dccabc = 10
        // ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 = 50
        // 2786f4877b9091dcad7f35751bfcf5d5ea712b2f = 100

        switch (barcodeData.text) {

          case "8c95def646b6127282ed50454b73240300dccabc":
            console.log("a acreditar 10")
            if (this.saldo == 0 || this.saldo == 50 || this.saldo == 100 || this.saldo == 150)
              this.acreditar(10)
            else
              this.toast.errorToast("Ya cargaste este código")
            break;

          case "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172 ":
            console.log("a acreditar 50")
            if (this.saldo == 0 || this.saldo == 10 || this.saldo == 100 || this.saldo == 110)
              this.acreditar(50)
            else
              this.toast.errorToast("Ya cargaste este código")
            break;

          case "2786f4877b9091dcad7f35751bfcf5d5ea712b2f":
            console.log("a acreditar 100")
            if (this.saldo == 0 || this.saldo == 10 || this.saldo == 50 || this.saldo == 60)
              this.acreditar(100)
            else
              this.toast.errorToast("Ya cargaste este código")
            break;

          default:
            break;
        }


        // var split = barcodeData.text.split("@");
        // console.log(split);
      }).catch(err => {
        console.log('Error', err);
      });
  }

  acreditar(monto: number) {
    console.log('monto', monto);
    var montoFinal = this.saldo + monto;
    this.dataServ.updateDatabase(this.idUser, montoFinal)
      .then(res => { this.toast.confirmationToast(`Acreditaste $${monto} a tu cuenta`) })
      .catch(err => {
        console.log("err", err)
        this.toast.errorToast("Error al acreditar")
      })
  }

  limpiar() {
    this.dataServ.updateDatabase(this.idUser, 0)
      .then(res => { this.toast.confirmationToast("Saldo reiniciado") })
      .catch(err => {
        console.log("err", err)
        this.toast.errorToast("Error al limpiar")
      })
  }

}
