import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import moment from 'moment';
import { combineLatest, forkJoin, map, shareReplay, tap } from 'rxjs';
import { TaskServiceService } from '../_services/task-service.service';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss']
})
export class BoardHeaderComponent implements OnInit {
  apiUrl = environment.apiUrl;

  constructor(private _taskServiceService:TaskServiceService,
    private _userService:UserService) { }

  currentBoard$ = this._taskServiceService.currentBoard$;
  boardUsers$ = this._taskServiceService.boardUsers$;
  statuses$ = this._taskServiceService.statuses$;
  priorities$ = this._taskServiceService.priorities$;
  user$ = this._userService.user$;

  ngOnInit(): void {
  
  }

  // users$ = combineLatest([
  //   this._taskServiceService.boardUsers$,
  //   this._userService.user$
  // ]).pipe(
  //   map(([allusers, myUser]) =>(
  //         allusers.map(user=>{
  //         })
  //     )),
  //     tap(res=>{
  //       console.log(res);
  //     }),
  //   shareReplay(1),
  //   );

  //members
  membersOptions=[];
  membersOption;
  onNgModelChangeMembers($event){
    this.membersOption=$event;
    if($event.length === 0){
      this._taskServiceService.usersAssignedFilter$.next(null)
    }else{
      this._taskServiceService.usersAssignedFilter$.next($event)
    }
  }

  //Due date
  statusOptions=[];
  statusOption;
  onNgModelChangeStatus($event){
    this.statusOption=$event;
    if($event.length === 0){
      this._taskServiceService.statusFilter$.next(null)
    }else{
      this._taskServiceService.statusFilter$.next($event)
    }

  }

   //stauts
   priority=[];
   priorityselect;
   onNgModelChangepriority($event){
      this.priorityselect=$event;
      if($event.length === 0){
        this._taskServiceService.priorityFilter$.next(null)
      }else{
        this._taskServiceService.priorityFilter$.next($event)
      }
   }
   
   dueDate=null;
   dueDateSelect;
   onNgModelChangedueDate($event){
      this.dueDateSelect=$event;
      if($event.length === 0){
        this._taskServiceService.dueData$.next(null)
      }else{
        this._taskServiceService.dueData$.next($event)
      }
      
   }

   keywordSerach=""
   onNgModelTitle($event){
    if($event.length === 0){
      this._taskServiceService.titleTaskFilter$.next(null)
    }else{
      this._taskServiceService.titleTaskFilter$.next($event)
    }
   }
}
