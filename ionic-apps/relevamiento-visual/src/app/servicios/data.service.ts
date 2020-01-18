import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { imagen } from '../modelos/imagen';
import { AuthService } from '../servicios/auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators'


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
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        });
      }));
  }

  getByTipo(tipo: number){
    return this.dbRef.snapshotChanges().pipe(
      map(files => {
        return files.map(c => {
          const data = c.payload.doc.data() as imagen;
          data.id = c.payload.doc.id;
          return data;
        })
        .filter(f => {
          if(tipo === 1)
            return f.tipo == 'linda'
          else
            return f.tipo == 'fea'
        })
        .sort((a, b) => {
          return new Date(b.created).getTime() - new Date(a.created).getTime();
        });
      }));
  }

  uploadToStorage(info): AngularFireUploadTask {
    this.newName = `${new Date().getTime()}.jpeg`;
    let image = `data:image/jpeg;base64,${info}`;
    return this.fStorage.ref(`files/${this.newName}`).putString(image, 'data_url');
  }

  storeInfoDatabase(metainfo, url, tipo) {
    return this.dbRef.doc(this.newName).set({
      votos: new Array(),
      url: url,
      created: metainfo.timeCreated,
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType,
      user: this.authService.getCurrentUserId(),
      email: this.authService.getCurrentUserMail(),
      tipo: tipo === 0 ? 'linda' : 'fea'
    });
  }

  updateDatabase(id, votos) {
    console.info("update id: ", id, "votos: ", votos);
    return this.dbRef.doc(id).update({
      votos: votos
    })
  }

}
