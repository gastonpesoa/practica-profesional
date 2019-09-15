import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators'
import { mensaje } from '../modelos/mensaje';
import { firestore } from 'firebase';


export interface chat {
  descripcion: string
  name: string
  id: string
  img: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private db: AngularFirestore) { }

  getChatRooms() {
    return this.db.collection("chatRoom").snapshotChanges().pipe(map(rooms => {
      return rooms.map(a => {
        const data = a.payload.doc.data() as chat;
        data.id = a.payload.doc.id;
        return data;
      })
    }))
  }

  getChatRoom(chat_id: string) {
    return this.db.collection("chatRoom").doc(chat_id).valueChanges();
  }

  sendMensajeAFirebase(mensaje: mensaje, chat_id: string) {
    this.db.collection("chatRoom").doc(chat_id).update({
      mensajes: firestore.FieldValue.arrayUnion(mensaje),
    })
  }
}
