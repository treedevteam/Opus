import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';
import { UserService } from 'app/core/user/user.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { TaskServiceService } from '../_services/task-service.service';

@Injectable({
  providedIn: 'root',
})
export class BoardRealtimeServiceService {
  pusher: any;
  userId: any;
  private _channel: BehaviorSubject<any | null> = new BehaviorSubject(null);

  get channel$(): Observable<any>
  {
      return this._channel.asObservable();
  }
  constructor(private _taskManagment: TaskServiceService) {
    
    this.pusher = new Pusher('25fcb6aa42752b05c6ce', {
      cluster: 'eu'
    });
    this._taskManagment.currentBoard$.subscribe(board=>{
      this._channel.next(this.pusher.subscribe(''+ board.id));
    })
  }
}
