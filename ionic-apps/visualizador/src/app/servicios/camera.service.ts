import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DataService } from './data.service';
import { Events } from '@ionic/angular';
import { AngularFireList } from '@angular/fire/database';
import { imagen } from '../modelos/imagen';
import { map } from 'rxjs/operators'
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CameraService {

  imagesRef;

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };

  optionsChoose: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
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

  choosePhoto() {
    return this.camera.getPicture(this.optionsChoose)
      .then(res => {
        return res;
      })
      .catch(error => {
        console.error(error);
        return error;
      });
  }

  uploadPhoto(info) {
    return this.dataServ.uploadToStorage(info)
      .then(res => {
        res.ref.getDownloadURL()
          .then(url => {
            this.events.publish('urlFotoGuardada', url);
            return url;
            // this.dataServ.storeInfoDatabase(res.metadata, url, tipo)
          })
          .catch(err => {
            console.error(err.message);
          })
      });
  }

  // GetAllimagens() {
  //   this.dataServ.getImages()
  //   return this.imagesRef.snapshotChanges()
  //     .pipe(
  //       map(changes =>
  //         changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
  //       )
  //     )
  //     .pipe(
  //       map(images => {
  //         return images.sort((a, b) => {
  //           return new Date(a.created).getTime() - new Date(b.created).getTime();
  //         });
  //       })
  //     );
  // }

  // GetAllimagensByType(tipo) {
  //   return this.GetAllimagens().pipe(
  //     map(images => {

  //       return images.filter(image => {
  //         switch (tipo) {
  //           case 'lindas':
  //             return image.tipo == 'linda';
  //           case 'feas':
  //             return image.tipo == 'fea';
  //         }
  //       });
  //     })
  //   );
  // }

  // GetimagensByUser(uid: String, tipo: string) {
  //   return this.GetAllimagensByType(tipo).pipe(
  //     map(images => {
  //       return images.filter(image => {
  //         return image.user === uid;
  //       });
  //     })
  //   );
  // }
}
