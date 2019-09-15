import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

import { mensaje } from '../../modelos/mensaje';
import { ChatService } from '../../servicios/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  public chat: any;
  // public mensaje: mensaje;
  public mensajes = [];
  public room: any;
  public msg: string;

  constructor(
    private navParams: NavParams,
    private modal: ModalController,
    private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.getChatRoom(this.chat.id).subscribe(room => {
      console.log(room);
      this.room = room;
    })
    this.chat = this.navParams.get('chat');
  }

  closeModal() {
    this.modal.dismiss();
  }

  sendMensaje() {
    const mensaje: mensaje = {
      content: this.msg,
      tipo: "text",
      date: new Date()
    };
    this.chatService.sendMensajeAFirebase(mensaje, this.chat.id);
    this.msg = "";
  }
}
