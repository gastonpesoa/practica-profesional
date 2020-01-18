import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators'
import { usuario } from '../modelos/usuario'
import { partido } from '../modelos/partido'


@Injectable({
  providedIn: 'root'
})
export class DataService {

  dbRef: AngularFirestoreCollection<any>;
  dbPartidosRef: AngularFirestoreCollection<any>;
  newName: string;

  constructor(private fStorage: AngularFireStorage, private db: AngularFirestore) {
    this.dbRef = this.db.collection("usuarios");
    this.dbPartidosRef = this.db.collection("partidos");
  }

  getUsuarios() {
    return this.dbRef.snapshotChanges().pipe(
      map(saldo => {
        return saldo.map(c => {
          const data = c.payload.doc.data() as usuario;
          data.id = c.payload.doc.id;
          return data;
        })
      }));
  }

  getPartidos() {
    return this.dbPartidosRef.snapshotChanges().pipe(
      map(partido => {
        return partido.map(c => {
          const data = c.payload.doc.data() as partido;
          data.id = c.payload.doc.id;
          return data;
        }).sort((a, b)=>{
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
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

  updateDatabase(id, partido) {
    console.info("update id: ", id, "partido: ", partido);
    return this.dbPartidosRef.doc(id).update(partido)
  }

  public crear(path: string, objeto: any): Promise<DocumentReference> {
    console.log('Entro al crear');
    console.log('objeto', objeto);
    return this.db.collection(path).add(objeto);
  }

  uploadToStorage(info): AngularFireUploadTask {
    this.newName = `${new Date().getTime()}.jpeg`;
    let image = `data:image/jpeg;base64,${info}`;
    return this.fStorage.ref(`files/${this.newName}`).putString(image, 'data_url');
  }

}



