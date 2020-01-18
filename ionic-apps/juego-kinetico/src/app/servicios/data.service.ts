import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { map } from 'rxjs/operators'
import { usuario } from '../modelos/usuario'


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
    this.dbRef = this.db.collection("usuarios");
  }

  getUsuarios() {
    return this.dbRef.snapshotChanges().pipe(
      map(saldo => {
        return saldo.map(c => {
          const data = c.payload.doc.data() as usuario;
          data.id = c.payload.doc.id;
          return data;
        }).sort((a, b) => {
          return b.record - a.record;
        })
      }));
  }

  getUsuarioByUid(uid: String) {
    return this.getUsuarios().pipe(
      map(user => {
        return user.filter(usuario => {
          return usuario.id === uid;
        });
      })
    );
  }

  updateDatabase(idUser, sec, heroe) {
    console.info("update id: ", idUser, "seg: ", sec, 'hero', heroe);
    return this.dbRef.doc(idUser).update({
      record: sec,
      heroe: heroe
    })
  }
}
