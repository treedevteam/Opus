/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { combineLatest, map, shareReplay, tap } from 'rxjs';
import { Board, Users } from '../../_models/task';
import { TaskServiceService } from '../../_services/task-service.service';

@Component({
  selector: 'app-asign-users-to-board',
  templateUrl: './asign-users-to-board.component.html',
  styleUrls: ['./asign-users-to-board.component.scss']
})
export class AsignUsersToBoardComponent implements OnInit {
  cardValue: any = {
    options: []
  };

  selectOptions: Array<Users>;

  apiUrl = environment.apiUrl;

  usersAssigned = this._taskService.boardUsers$;
  departmentUsers = this._taskService.departmentUsers$;
  usersAssigned$ = this._taskService.usersAssigned$;





  currentBoard: Board;
  constructor(private _taskService: TaskServiceService) { }

  ngOnInit(): void {
    this._taskService.usersAssigned$.subscribe((res)=>{
      this.selectOptions = res.users;
    });

   this._taskService.currentBoard$.subscribe((res)=>{
     this.currentBoard = res;

   });

  }




  getDepartmentUsers(id: number){
    this._taskService.getUsersDepartment(id).subscribe((res)=>{
      this.selectOptions = res;
    });
  }

  selectChange = (event: any) => {
    const key: string = event.key;
    this.cardValue[key] = [ ...event.data ];

    console.log(this.cardValue);
  };


  assignUserToBoard(userId: number){
    this._taskService.assignUserToBoard(this.currentBoard.id , userId).subscribe((res)=>{
      console.log(res);
    });
  }

}
