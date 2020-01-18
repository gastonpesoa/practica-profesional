import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker/ngx';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class CameraService {

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    correctOrientation: true
  };

  imagePickerOptions: ImagePickerOptions = {
    quality: 50,
    outputType: 1
  };

  constructor(
    private dataServ: DataService,
    private camera: Camera,
    private imagePicker: ImagePicker) {
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
    return this.imagePicker.getPictures(this.imagePickerOptions)
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(error => {
        console.error(error);
        return error;
      });
  }

  uploadPhoto(info, tipo) {
    return this.dataServ.uploadToStorage(info)
      .then(res => {
        res.ref.getDownloadURL()
          .then(url => {
            this.dataServ.storeInfoDatabase(res.metadata, url, tipo)
          })
          .catch(err => {
            console.error(err.message);
          })
      });
  }

  // GetAllimagens() {
  //   return this.imagesRef.snapshotChanges()
  //     .pipe(
  //       map(changes =>
  //         changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
  //       )
  //     )
  //     .pipe(
  //       map(images => {
  //         return images.sort((a, b) => {
  //           return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
  //         });
  //       })
  //     );
  // }

  // GetAllimagensByType(tipo: TipoLista) {
  //   return this.GetAllimagens().pipe(
  //     map(images => {

  //       return images.filter(image => {
  //         switch (tipo) {
  //           case TipoLista.CosasLindas:
  //             return image.esLinda;
  //           case TipoLista.CosasFeas:
  //             return !image.esLinda;
  //         }
  //       });
  //     })
  //   );
  // }

  // GetimagensByUser(uid: String, tipo: TipoLista) {
  //   return this.GetAllimagensByType(tipo).pipe(
  //     map(images => {
  //       return images.filter(image => {
  //         this.spinner.hide();
  //         return image.uid === uid;
  //       });
  //     })
  //   );
  // }
}

