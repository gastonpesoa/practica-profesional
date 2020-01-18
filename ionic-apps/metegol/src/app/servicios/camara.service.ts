import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DataService } from './data.service';
import { Events } from '@ionic/angular';
import { AngularFireList } from '@angular/fire/database';
import { map } from 'rxjs/operators'
import { AngularFirestore } from '@angular/fire/firestore';
import { partido } from '../modelos/partido'

@Injectable({
  providedIn: 'root'
})
export class CamaraService {

  imagesRef;

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };

  constructor(
    private db: AngularFirestore,
    public events: Events,
    private dataServ: DataService,
    private camera: Camera) {
    this.imagesRef = this.db.collection("files");
  }

  takePhoto() {
    return this.camera.getPicture(this.options)
      .then(res => {
        return res;
      })
      .catch(error => {
        console.error(error);
        return error;
      });
  }

  uploadPhoto(info, partido: partido) {
    return this.dataServ.uploadToStorage(info)
      .then(res => {
        res.ref.getDownloadURL()
          .then(url => {
            // this.events.publish('urlFotoGuardada', url);
            // return url;
            partido.urlFoto = url
            this.dataServ.updateDatabase(partido.id, partido)
          })
          .catch(err => {
            console.error(err.message);
          })
      });
  }
}
