import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { WebSocketServiceService } from 'app/modules/web-socket-service.service';
import { TaskServiceService } from './_services/task-service.service';
import Pusher from 'pusher-js';
import { tap } from 'rxjs';
import { BoardRealtimeServiceService } from './real_time_services/boardtasks_realtime.services';

@Component({
  selector: 'app-task-managment',
  templateUrl: './task-managment.component.html',
  styleUrls: ['./task-managment.component.scss']
})
export class TaskManagmentComponent implements OnInit {
  pusher: any;
  channel: any;
  userId: any;

  constructor(private realTimeService:BoardRealtimeServiceService, private _taskManagment:TaskServiceService) { 
  }

  ngOnInit(): void {
      this.realTimeService.channel$.subscribe(channel=>{
        channel.bind('task-event', data => {
          debugger;
          console.log(data,".handlePosherActions(data");
            this._taskManagment.handlePosherActions(data).subscribe(res=>{
              console.log(res,".handlePosherActions(data");
            })
          });
      })      
  }
  

}
