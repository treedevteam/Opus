import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root',
})
export class WebSocketServiceService {
  pusher: any;
  channel: any;
  test: any;
  userInfo: any;
  userId: any;
  constructor(private http: HttpClient) {
    if(localStorage.getItem('user_info')){
      const userinfo = localStorage.getItem('user_info');
      if(userinfo === 'undefined'){
        localStorage.removeItem('user_info');
      }else{
        this.userId = JSON.parse(localStorage.getItem('user_info'))?.id;
        this.pusher = new Pusher('25fcb6aa42752b05c6ce', {
          cluster: 'eu'
        });
        this.channel = this.pusher.subscribe(''+ this.userId);
      }
    }else{
      this.userId = null;
    }

  }
}
