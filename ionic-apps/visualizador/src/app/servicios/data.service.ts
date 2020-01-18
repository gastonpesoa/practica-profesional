import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators'
import { imagen } from '../modelos/imagen';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  newName: string;
  dbRef: AngularFirestoreCollection<any>;

  constructor(
    private db: AngularFirestore,
    private authService: AuthService,
    private db2: AngularFireDatabase,
    private fStorage: AngularFireStorage) {
    this.dbRef = this.db.collection("files");
  }

  getImages() {
    return this.dbRef.snapshotChanges().pipe(
      map(files => {
        return files.map(c => {
          const data = c.payload.doc.data() as imagen;
          data.id = c.payload.doc.id;
          return data;
        }).sort((a, b) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });
      }));
  }

  getByTipo(tipo: string) {
    return this.dbRef.snapshotChanges().pipe(
      map(files => {
        return files.map(c => {
          const data = c.payload.doc.data() as imagen;
          data.id = c.payload.doc.id;
          return data;
        })
          .filter(f => {
            if (tipo === 'linda')
              return f.tipo == 'linda'
            else
              return f.tipo == 'fea'
          })
          .sort((a, b) => {
            return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          });
      }));
  }

  getImagensByUser(uid: String, tipo: string) {
      return this.getByTipo(tipo).pipe(
        map(images => {
          return images.filter(image => {
            return image.user === uid;
          });
        })
      );
    }

  uploadToStorage(info): AngularFireUploadTask {
    this.newName = `${new Date().getTime()}.jpeg`;
    let image = `data:image/jpeg;base64,${info}`;
    return this.fStorage.ref(`files/${this.newName}`).putString(image, 'data_url');
  }

  storeInfoDatabase(fotosList) {
    console.info("fotosList", fotosList)
    fotosList.forEach(element => {
      var uid = this.db.createId();
      element.id = uid;
      this.dbRef.doc(uid).set(element);
    });
  }

  updateDatabase(id, votos) {
    console.info("update id: ", id, "votos: ", votos);
    return this.dbRef.doc(id).update({
      votos: votos
    })
  }
}
