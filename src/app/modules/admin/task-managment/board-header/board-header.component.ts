import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import moment from 'moment';
import { combineLatest, forkJoin, map, shareReplay, tap } from 'rxjs';
import { Boards } from '../../departments/departments.types';
import { Board } from '../_models/task';
import { TaskServiceService } from '../_services/task-service.service';
import { AsignUsersToBoardComponent } from './asign-users-to-board/asign-users-to-board.component';

@Component({
  selector: 'app-board-header',
  templateUrl: './board-header.component.html',
  styleUrls: ['./board-header.component.scss']
})
export class BoardHeaderComponent implements OnInit {
  apiUrl = environment.apiUrl;
  currentBoard:Board

  constructor(private _taskServiceService:TaskServiceService,
    private _userService:UserService,
    private dialog: MatDialog,
    ) { }

  currentBoard$ = this._taskServiceService.currentBoard$;
  boardUsers$ = this._taskServiceService.boardUsers$;
  statuses$ = this._taskServiceService.statuses$;
  priorities$ = this._taskServiceService.priorities$;
  user$ = this._userService.user$;

  ngOnInit(): void {
    this.currentBoard$.subscribe(res=>{
      this.currentBoard = res
    })
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
      debugger;
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

   assignUserPopup(): void {
    this._taskServiceService.getUsersDepartment(+this.currentBoard.department_id).subscribe((res)=>{
        const dialogRef = this.dialog.open(AsignUsersToBoardComponent, {
            width: '100%',
            maxWidth:'700px',
            height:'400px',
            maxHeight:'100%'
          });

          dialogRef.afterClosed().subscribe((result) => {
          });
    });
  }

  assignUserToBoard(userId: number){
    this._taskServiceService.assignUserToBoard(this.currentBoard.id , userId).subscribe((res)=>{
      console.log(res);
    });
  }
}
