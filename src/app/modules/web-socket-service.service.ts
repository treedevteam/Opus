import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class WebSocketServiceService {
  pusher: any;
  channel: any;
  test:any;
  userInfo: any;
  userId: any;
  constructor(private http: HttpClient) {
    // this.userInfo = JSON.parse(localStorage.getItem('user_info') ?? '');
    if(localStorage.getItem('user_info')){
      this.userId = JSON.parse(localStorage.getItem('user_info')).id;
    }else{
      this.userId = null;
    }
    // console.log(this.userInfo);
    this.pusher = new Pusher('25fcb6aa42752b05c6ce', {
      cluster: 'eu'
    });
    this.channel = this.pusher.subscribe(''+ this.userId);
  }
}
