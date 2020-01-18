import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators'

interface usuario {
  id: string;
  saldo: string;
  perfil: string;
  sexo: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  dbRef: AngularFirestoreCollection<any>;

  constructor(private db: AngularFirestore) {
    this.dbRef = this.db.collection("usuarios");
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

  getUsuarioByUid(uid: String) {
    return this.getUsuarios().pipe(
      map(user => {
        return user.filter(usuario => {
          return usuario.id === uid;
        });
      })
    );
  }

  updateDatabase(id, saldo) {
    console.info("update id: ", id, "saldo: ", saldo);
    return this.dbRef.doc(id).update({
      saldo: saldo
    })
  }
}



