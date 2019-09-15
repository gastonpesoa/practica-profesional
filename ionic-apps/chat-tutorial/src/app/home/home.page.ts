import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service'
import { ChatService, chat } from '../servicios/chat.service'
import { ModalController, ActionSheetController } from '@ionic/angular'
import { ChatComponent } from '../componentes/chat/chat.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  public chatRooms: any = [];

  constructor(public Afauth: AuthService, public chatService: ChatService,
    private modal: ModalController,
    public actionSheetController: ActionSheetController) { }

  OnLogOut() {
    this.Afauth.logout();
  }

  openChat(chat) {
    this.modal.create({
      component: ChatComponent,
      componentProps: {
        chat: chat
      }
    }).then((modal) => modal.present());
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [{
        text: 'Desconectarse',
        role: 'destructive',
        icon: 'log-out',
        handler: () => {
          this.OnLogOut();
        },
      }]
    });
    await actionSheet.present();
  }

  ngOnInit() {
    this.chatService.getChatRooms().subscribe(chats => {
      this.chatRooms = chats;
    })
  }
}
