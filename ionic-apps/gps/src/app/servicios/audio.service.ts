import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';


@Injectable({
  providedIn: 'root'
})
export class AudioService {
  file: MediaObject;

  // recording: boolean = false;
  // filePath: string;
  // fileName: string;
  // audio: MediaObject;
  // audioList: any[] = [];

  // constructor(private media: Media) {
  // }

  // play() {

  //   this.file = this.media.create('file.mp3');
  // }

  // playAudio(file, idx) {

  //   this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
  //   this.audio = this.media.create(this.filePath);

  //   this.audio.play();
  //   this.audio.setVolume(0.8);
  // }
}
