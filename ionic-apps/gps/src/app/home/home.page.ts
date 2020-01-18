import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service'
import { ModalController, ActionSheetController } from '@ionic/angular'
import { GeolocationService } from '../servicios/geolocation.service';
import { Map, latLng, tileLayer, Layer, marker, icon } from 'leaflet';
import { ToastService } from '../servicios/toast.service';
import { CrearAlarmaComponent } from '../componentes/crear-alarma/crear-alarma.component'
import { MisDireccionesComponent } from '../componentes/mis-direcciones/mis-direcciones.component';


const myIcon = icon({
  iconUrl: '../../assets/marker-icon.png',
  iconSize: [30, 50],
  iconAnchor: [14, 50],
  popupAnchor: [1, -43],
  shadowUrl: '../../assets/marker-shadow.png',
  shadowSize: [50, 50],
  shadowAnchor: [13, 50]
});

const myIconDest = icon({
  iconUrl: '../../assets/marker-icon-dest.png',
  iconSize: [60, 60],
  iconAnchor: [25, 50],
  popupAnchor: [1, -43],
  shadowUrl: '../../assets/marker-shadow.png',
  shadowSize: [50, 50],
  shadowAnchor: [13, 50]
});

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  subscription: any;
  map: Map;
  lat: any;
  lng: any;
  mapaCargado: boolean = false;
  marker: any;
  direccion = null
  markerDestino: any;
  distanciaADestino: number;
  distanciaAlarma: any;
  alarmaActivada: boolean = false;
  content: HTMLButtonElement;
  sirenaAudio = new Audio('../../assets/alarma.mp3')
  mensaje: string = '';
  sirenaSonando: any = false;
  statusLigth: HTMLButtonElement;

  constructor(
    public toast: ToastService,
    public geolocation: GeolocationService,
    public Afauth: AuthService,
    private modal: ModalController,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    setTimeout(() => {
      this.watchLocation();
      // this.getCurrentPosition();
    }, 100)
    this.content = (document.getElementById('content') as HTMLButtonElement);
    this.statusLigth = (document.getElementById('gps-status') as HTMLButtonElement);
  }

  public ionViewDidEnter() {
    // this.mensaje +=  "ionViewDidEnter"

  }

  public ionViewDidLeave() {
    // this.mensaje +=  "ionViewDidLeave"
    // document.getElementById("map").outerHTML = "";
    // this.mapaCargado = false;
    // this.subscription = null;
  }

  watchLocation() {
    console.log("watchLocation")
    this.subscription = this.geolocation.watchPosition();
    this.subscription.subscribe((data) => {
      this.statusLigth.classList.remove('gps-status')
      this.statusLigth.classList.add('gps-status-activo')
      setTimeout(() => {
        this.statusLigth.classList.remove('gps-status-activo')
        this.statusLigth.classList.add('gps-status')
      }, 1000);
      // data can be a set of coordinates, or an error (if an error occurred).
      console.log("latitude", data.coords.latitude)
      console.log("longitude", data.coords.longitude)
      this.lat = data.coords.latitude
      this.lng = data.coords.longitude
      if (!this.mapaCargado) {
        // this.mensaje += " - mapa no cargado"
        this.leafletMap();
      }
      this.setMarker();
      if (this.distanciaAlarma) {
        this.verificarDistancia(this.direccion, this.distanciaADestino)
      }
    });
  }

  getCurrentPosition() {
    this.geolocation.getCurrentPosition().then(data => {
      console.log("latitude", data.coords.latitude)
      console.log("longitude", data.coords.longitude)
    })
  }

  leafletMap() {
    if (!this.mapaCargado) {
      this.mapaCargado = true;
    }
    // this.mensaje += " - mapa cargado"
    this.map = new Map('map').setView([this.lat, this.lng], 12);
    tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2FzdG9ucGVzb2EiLCJhIjoiY2s0OGxrNHU4MTdiODNrbm5pYjF4c2FlcyJ9.n7opdP3OkwqTsih4WJ_eQA', {
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'pk.eyJ1IjoiZ2FzdG9ucGVzb2EiLCJhIjoiY2s0OGxrNHU4MTdiODNrbm5pYjF4c2FlcyJ9.n7opdP3OkwqTsih4WJ_eQA'
    }).addTo(this.map);
  }

  setMarker() {
    if (this.marker) {
      this.marker.remove();
    }
    this.marker = marker([this.lat, this.lng], { icon: myIcon }).addTo(this.map)
      .bindPopup('Tu ubicación')
      .openPopup();
  }

  OnLogOut() {
    // document.getElementById("map").outerHTML = "";
    // this.mapaCargado = false;
    // this.subscription = null;
    if(this.alarmaActivada){
      this.desactivarAlarma();
    }
    if (this.markerDestino) {
      this.markerDestino.remove();
    }
    this.direccion = null;
    this.distanciaADestino = null;
    this.Afauth.logout();
  }

  async agregarDireccion() {
    const modal = await this.modal.create({
      component: CrearAlarmaComponent
    })
    modal.present();
    const data = await modal.onDidDismiss();
    if (data.data) {
      console.log("data", data);
      console.log("alarma", data.data.alarma);
      var alarma = data.data.alarma;
      this.direccion = alarma.domicilio;
      this.distanciaAlarma = alarma.distancia;
      if (this.markerDestino) {
        this.markerDestino.remove();
      }
      this.markerDestino = marker([alarma.domicilio.lat, alarma.domicilio.long], { icon: myIconDest }).addTo(this.map)
        .bindPopup('Destino')
        .openPopup();
      this.verificarDistancia(alarma.domicilio, alarma.distancia)
    }
  }

  async misDirecciones() {
    const modal = await this.modal.create({
      component: MisDireccionesComponent
    })
    modal.present();
    const data = await modal.onDidDismiss();
    if (data.data) {
      console.log("alarma", data.data.alarma);
      var alarma = data.data.alarma;
      this.direccion = alarma.domicilio;
      this.distanciaAlarma = alarma.distancia;
      if (this.markerDestino) {
        this.markerDestino.remove();
      }
      this.markerDestino = marker([alarma.domicilio.lat, alarma.domicilio.long], { icon: myIconDest }).addTo(this.map)
        .bindPopup('Destino')
        .openPopup();
      this.verificarDistancia(alarma.domicilio, alarma.distancia)
    }
  }

  verificarDistancia(domicilio: any, distancia: any) {
    this.distanciaADestino = this.geolocation.getDistanceFromLatLonInKm(this.lat, this.lng, domicilio.lat, domicilio.long);
    console.log("this.distanciaADestino", this.distanciaADestino)
    this.verificarAlarma();
  }

  verificarAlarma() {
    if (this.alarmaActivada && this.distanciaADestino < this.distanciaAlarma) {
      if (!this.sirenaSonando) {
        this.sirenaSonando = true;
        this.sirenaAudio.load();
        this.sirenaAudio.play();
        setTimeout(() => {
          this.sirenaAudio.pause();
        }, 8000);
      }
    }
  }

  activarAlarma() {
    this.alarmaActivada = true;
    this.content.classList.add('alarma-activada');
    this.verificarAlarma();
  }

  desactivarAlarma() {
    this.alarmaActivada = false;
    this.content.classList.remove('alarma-activada');
    this.sirenaAudio.pause();
    this.sirenaAudio.currentTime = 0;
    this.sirenaSonando = false;
  }

}
