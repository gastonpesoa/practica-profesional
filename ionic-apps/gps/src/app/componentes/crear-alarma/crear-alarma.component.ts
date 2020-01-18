import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/servicios/data.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { NavParams, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth.service';
import { GeocodingService } from 'src/app/servicios/geocoding.service';
import { usuario } from '../../modelos/usuario'
import { Response } from '../../modelos/response'
import { GeolocationService } from 'src/app/servicios/geolocation.service';
import { SpinnerService } from 'src/app/servicios/spinner.service';


interface response {
  id: any;
  display_name: string;
  lat: string;
  long: string;
}

interface alarma {
  domicilio: response;
  distancia: any;
  fecha: string;
  alarma: string;
}

@Component({
  selector: 'app-crear-alarma',
  templateUrl: './crear-alarma.component.html',
  styleUrls: ['./crear-alarma.component.scss'],
})
export class CrearAlarmaComponent implements OnInit {
  userMail: string;
  uid: string;
  ciudad: any;
  domicilio: any;
  provincia: any;
  distancia: any;
  resultadosDomicilio: response[] = [];
  mockResponse: response[] = [
    {
      id: 8751417,
      display_name: "UTN Facultad Regional Avellaneda, 750, Avenida Bartolomé Mitre, Barrio Mariano Moreno, Crucecita, Avellaneda, Partido de Avellaneda, Buenos Aires, 1870, Argentina",
      lat: "-34.6623821",
      long: "-58.3645907"
    },
    {
      id: 49901206,
      display_name: "EP N° 1 Nicolas Avellaneda, 750, Avenida Bartolomé Mitre, Barrio Mariano Moreno, Crucecita, Avellaneda, Partido de Avellaneda, Buenos Aires, 1870, Argentina",
      lat: "-34.6623594",
      long: "-58.364796"
    },
    {
      id: 262322699,
      display_name: "Mitre, Barrio Cooperacion 2, Cooperación, Avellaneda, Bahía Blanca, Partido de Bahía Blanca, Buenos Aires, 8.000, Argentina",
      lat: "-38.6918241",
      long: "-62.2957788"
    }
  ];
  domicilioSeleccionado: response = null;
  usuario: usuario;
  distanciaADestino: number;

  constructor(
    public spinner: SpinnerService,
    public geolocation: GeolocationService,
    private geocoding: GeocodingService,
    private dataServ: DataService,
    private toast: ToastService,
    private navParams: NavParams,
    private modal: ModalController,
    private authService: AuthService) { }

  ngOnInit() {
    this.userMail = this.authService.getCurrentUserMail();
    this.uid = this.authService.getCurrentUserId();
    this.dataServ.getUsuarioByUid(this.uid).subscribe(res => {
      console.log("this user", res[0])
      this.usuario = res[0]
    })
  }

  closeModal(alarma) {
    this.domicilio = null
    this.ciudad = null
    this.provincia = null
    this.distancia = null
    this.resultadosDomicilio = []
    this.domicilioSeleccionado = null;
    if (alarma) {
      this.modal.dismiss({
        alarma: alarma
      });
    } else {
      this.modal.dismiss()
    }
  }

  verificarDomicilio() {
    if (this.domicilio == null || this.ciudad == null || this.provincia == null) {
      this.toast.errorToast("Completá los campos")
    } else {
      this.spinner.showLoadingSpinner()
      this.geocoding.getLocation(this.domicilio, this.ciudad, this.provincia)
        .then(data => {
          this.spinner.hideLoadingSpinner()
          var response = JSON.parse(data.data)
          if (response.length > 0) {
            this.proccesResponse(response)
          } else {
            this.toast.errorToast("No se encontraron resultados, verificá los datos y  volvé a intentar")
          }
        })
        .catch(error => {
          // alert("error" + error)
          this.spinner.hideLoadingSpinner()
          this.toast.errorToast(`Error: ${error}`)
          this.resultadosDomicilio = this.mockResponse;
        });
    }
  }

  proccesResponse(resultadoDomicilio: any) {
    // alert("proccesResponse " + resultadoDomicilio)
    resultadoDomicilio.forEach(element => {
      // alert("element  " + element)
      var result: response = {
        id: element.place_id,
        display_name: element.display_name,
        lat: element.lat,
        long: element.lon
      }
      this.resultadosDomicilio.push(result);
    });
  }

  selectDomicilio(item: response) {
    console.log(item.id);
    this.domicilioSeleccionado = item;
    this.geolocation.getCurrentPosition().then(data => {
      console.log("latitude", data.coords.latitude)
      console.log("longitude", data.coords.longitude)
      this.distanciaADestino = this.geolocation.getDistanceFromLatLonInKm(
        data.coords.latitude, data.coords.longitude, item.lat, item.long);
      console.log("this.distanciaADestino", this.distanciaADestino)
    })
  }

  agregarDomicilio() {
    if (this.distancia == null) {
      this.toast.errorToast("Ingresá una distancia mínima de la alarma")
    } else {
      var alarma: alarma = {
        domicilio: this.domicilioSeleccionado,
        distancia: this.distancia,
        fecha: this.parseDateTimeToStringDateTime(new Date()),
        alarma: ""
      }
      console.log("this.usuario.alarma", this.usuario.alarma)
      this.usuario.alarma.push(alarma)
      this.dataServ.updateDatabase(this.uid, this.usuario.alarma)
      this.toast.confirmationToast("Alarma agregada al domicilio")
      this.closeModal(alarma)
    }
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

}
