import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CameraService } from 'src/app/servicios/camera.service';
import { AuthService } from 'src/app/servicios/auth.service';
import { ToastService } from 'src/app/servicios/toast.service';
import { Events } from '@ionic/angular';
import { DataService } from 'src/app/servicios/data.service';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  title: string;
  galleryType: string;
  allPhotos: any[];
  currentUserId: any;
  myPhotos: any[];
  urlsFoto: any[];
  fotosCargadas: boolean;
  tipo: string;
  currentUserEmail: string;
  barChart: any;
  doughnutChart: any;
  labels: any[];
  data: any[];
  colors: string[];
  imgSelected: any;

  constructor(
    public events: Events,
    private router: Router,
    private camServ: CameraService,
    private dataServ: DataService,
    private authService: AuthService,
    private toastService: ToastService) {

    this.galleryType = 'todas';
    if (this.router.url === '/list/cosasLindas') {
      this.tipo = 'linda'
      this.title = 'Cosas Lindas';
    } else {
      this.tipo = 'fea'
      this.title = 'Cosas Feas';
    }
    this.dataServ.getByTipo(this.tipo).subscribe(images => {
      this.allPhotos = images;
      console.log("allPhotos", this.allPhotos);
    });
    this.currentUserId = this.authService.getCurrentUserId();
    this.currentUserEmail = this.authService.getCurrentUserMail();
    console.log("currentUserId", this.currentUserId);

    this.dataServ.getImagensByUser(this.currentUserId, this.tipo).subscribe(images => {
      this.myPhotos = images;
      console.log("myPhotos", this.myPhotos);
    });
  }

  ngOnInit() {
    this.urlsFoto = new Array<string>();
  }

  ionChangeSegment() {
    this.labels = this.allPhotos.map((foto, index) => { return index + 1 })
    this.data = this.allPhotos.map(foto => { return foto.votos.length })
    this.colors = this.allPhotos.map(foto => { return this.getRandomColor() })
    if (this.galleryType === 'estadisticas') {
      if (this.tipo === 'linda') {
        setTimeout(() => {
          this.doughnutChartMethod();
        }, 1000);
      }
      if (this.tipo === 'fea') {
        setTimeout(() => {
          this.barChartMethod();
        }, 100);
      }
    }
  }

  mostrar() {
    console.log("galleryType", this.galleryType)
  }

  elegirFoto(tipo: number) {
    this.camServ.choosePhoto()
      .then(imageData => {
        if (imageData !== 'No Image Selected') {
          this.subirFoto(imageData, tipo);
        } else {
          this.toastService.errorToast('No eligió una foto.');
        }
      })
      .catch(error => {
        this.toastService.errorToast('Error: No se han podido cargar las fotos. ' + error.message);
      });
  }

  tomarFoto(tipo: number) {
    this.camServ.takePhoto()
      .then(imageData => {
        if (imageData !== 'No Image Selected') {
          this.subirFoto(imageData, tipo);
        } else {
          this.toastService.errorToast('No tomó la foto.');
        }
      })
      .catch(error => {
        this.toastService.errorToast('Error: No se ha podido cargar la foto. ' + error.message);
      });
  }

  subirFoto(imageData, tipo) {
    this.camServ.uploadPhoto(imageData)
      .then(() => {
        // this.toastService.confirmationToast("Foto guardada")
      })
      .catch(err => {
        this.toastService.errorToast('Error: No se ha podido guardar la foto. ' + err.message);
      })

    this.events.subscribe('urlFotoGuardada', url => {
      var contains = false;
      this.urlsFoto.forEach(element => {
        if (element.url === url)
          contains = true;
      })
      if (!contains) {
        this.urlsFoto.push({
          url: url,
          tipo: tipo,
          user: this.currentUserId,
          email: this.currentUserEmail,
          votos: new Array(),
          fecha: this.parseDateTimeToStringDateTime(new Date())
        });
      }
    });
  }

  subirFotos() {
    this.dataServ.storeInfoDatabase(this.urlsFoto)
    this.urlsFoto = new Array<string>();
  }

  barChartMethod() {

    var handleClick = (evt) => {
      var activeElement = this.barChart.getElementAtEvent(evt)[0];
      if (activeElement) {
        var label = this.barChart.data.labels[activeElement._index];
        this.imgSelected = this.allPhotos[label - 1]
      }
    }

    var canvas = document.getElementById('barCanvas');
    var ctx = (<any>document.getElementById('barCanvas')).getContext('2d');
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          label: '# de Votos',
          data: this.data,
          backgroundColor: this.colors,
          borderColor: this.colors,
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        onClick: handleClick
      }
    });
  }

  doughnutChartMethod() {

    var handleClick = (evt) => {
      var activeElement = this.doughnutChart.getElementAtEvent(evt)[0];
      if (activeElement) {
        var label = this.doughnutChart.data.labels[activeElement._index];
        this.imgSelected = this.allPhotos[label - 1]
      }
    }

    var ctx = (<any>document.getElementById('doughnutCanvas')).getContext('2d');
    console.log("ctx", ctx)
    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [{
          label: '# de Votos',
          data: this.data,
          backgroundColor: this.colors,
          hoverBackgroundColor: this.colors
        }]
      },
      options: {
        onClick: handleClick
      }
    });

  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
